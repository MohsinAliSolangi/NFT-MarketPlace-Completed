// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        require(_auctionDetail[_itemId].auction == false,"Auction Not End"); 
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
    
    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }

    /////////////////////////////////// This is Auction /////////////////////////////

    receive() external payable{
    }

    fallback() external payable{     
    }
    
    uint256 public totalVolume;
    uint256 public totalAuctionCompleted;  

    mapping(uint256 => AuctionDetails) private _auctionDetail;
    // BidsPayedPerToken 
    mapping(address => mapping(uint256 => uint256)) public payedBids;  
     // Array of bids in an auction 
    mapping(uint256 => Bid[]) private auctionBids; 

    
    struct AuctionDetails { 
    
    bool auction;

    uint256 itemId; 
    // Current owner of NFT 
    address payable seller; 
    // Price (in wei) at beginning of auction 
    uint256 basePrice; 
    // Highest bidder 
    address highestBidder; 
    // Highest bid (in wei) 
    uint256 highestBid; 
    // Duration (in seconds) of auction 
    uint256 endTime; 
    // Time when auction started 
    uint256 starTime; 
    // To check if the auction has ended 
    bool ended; 
    }
    
         
    struct Bid { 
    // Bidder's address 
    address bidder; 
    // Bidders amount 
    uint256 amount; 
    // Time 
    uint256 biddingUnix; 
    }  


    //This function for createAuction 
    function createAuction(IERC721 _nft, uint256 _tokenId, uint256 _basePrice, uint256 endTime) public {

        require(_basePrice > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        endTime = endTime * 1 seconds; 
        endTime = block.timestamp + endTime;
        // add new item to items mapping
        _auctionDetail[itemCount] = AuctionDetails
        (true,itemCount,payable(msg.sender),_basePrice,address(0),0,endTime,block.timestamp,false); 
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _basePrice,
            payable(msg.sender),
            false
        );  
    } 

    
  
    //This funtion for make Bid 
    function bid(uint256 itemId) public payable { // msg.sender -> address parameter 
   
    AuctionDetails memory auction = _auctionDetail[itemId]; 
    require(auction.ended == false , "Auction has ended"); 
    require(auction.seller !=address(0),"Auction does not exist"); 
    
    // end = auction.ended; 
    // _updateStatus(itemId); 
  
    if(block.timestamp < auction.endTime){  
  
    //uint256 amount = payedBids[_msgSender()][_nftContract][_tokenId]; 

    uint256 amount = payedBids[msg.sender][itemId]; 
  
    require (auction.highestBid < msg.value + amount && auction.basePrice<=msg.value + amount ,"Please send more funds"); 
    require (msg.sender != auction.seller, 'You cannot bid in your own auction' ); 
  
    payedBids[msg.sender][itemId]=amount + msg.value; 
    amount = payedBids[msg.sender][itemId]; 
  
    auction.highestBid = amount; 
    auction.highestBidder = msg.sender; 
    auctionBids[itemId].push(Bid(msg.sender,amount,block.timestamp)); 
    _auctionDetail[itemId] = auction; 
    totalVolume += msg.value ; 
    }  
    } 

    //This function is concludeAuction finilise the highest bider 
    function concludeAuction(uint256 itemId,address _msgSender) payable public { 
  
    AuctionDetails memory auction = _auctionDetail[itemId]; 
    require((_msgSender == _auctionDetail[itemId].seller) || (_msgSender == _auctionDetail[itemId].highestBidder), 'You are not authorized to conclude the auction' ); 
    require(auction.endTime < block.timestamp,"Auction Time remaining"); 
  
    bool ended = _checkAuctionStatus(itemId); 
   
  
    if(!ended){ 
    _updateStatus(itemId); 
    } 
    Item storage item = items[itemId];
    item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        
    // update item to sold
    item.sold = true;
     
    // emit Bought event
    emit Bought(
        itemId,
        address(item.nft),
        item.tokenId,
        item.price,
        item.seller,
        msg.sender
        );

    delete payedBids[auction.highestBidder][itemId]; 
    uint256 payment = auction.highestBid * 1 wei; 
    payable (address(this)).transfer(payment); 
    totalAuctionCompleted ++; 
    } 
    
    //This function is use for is Auction End or Not
    function _checkAuctionStatus(uint256 itemId) public view returns(bool){  
    AuctionDetails memory auction = _auctionDetail[itemId];  
    require( auction.seller != address(0) , 'Auction for this NFT is not in progress'); 
    return auction.ended;   
    }

    //This Function for change status
    function _updateStatus(uint256 itemId) public { //private 
    AuctionDetails memory auction = _auctionDetail[itemId]; 
    require(auction.ended == false,"This auction has Ended"); 

    if(block.timestamp > auction.endTime){ 
    auction.ended = true; 
    } 
    _auctionDetail[itemId] = auction;
    _auctionDetail[itemId].auction = false;

    }

    function isAuction(uint256 itemId) public view returns(bool) {
        if(_auctionDetail[itemId].auction == true){
            return true;
        }
        else {
            return false;
        }         
    } 

    function getLastTime(uint256 itemId) public view returns(uint){ 
     AuctionDetails memory auction= _auctionDetail[itemId]; 
    return auction.endTime; 
    } 

  
}