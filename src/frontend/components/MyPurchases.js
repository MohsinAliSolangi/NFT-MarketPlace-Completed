import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, ModalBody } from 'react-bootstrap'
// import {PriceModal} from './PriceModal'
// import React,{ useState } from "react"
import { Modal, ModalHeader,Form } from "reactstrap"
import { getValue } from '@testing-library/user-event/dist/utils'
//import { Price } from "./Price"

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const [modal, setmodal]= useState(false)
  const [Auction, setAuction]= useState(false)
  const [price, setPrice]= useState(null)
  const [Time, setTime]= useState(null)
  // const [Sale, setSale] = useState([])

  const loadPurchasedItems = async () => {

  const tokenCount = await nft.tokenCount()
  let purchasedItem=[];
  for(let i=1; i<=tokenCount;i++){
  const ownerof = await nft.ownerOf(i) 
  if (account.toString().toLowerCase() == ownerof.toString().toLowerCase()){
    // // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    // const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    // const results = await marketplace.queryFilter(filter)
    // //Fetch metadata of each nft and add that to listedItem object.
    // const purchases = await Promise.all(results.map(async i => {
    //   // fetch arguments from each result
    //   i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      // const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      purchasedItem.push({
        nft:nft.address,
        itemId: i,
        marketplace: marketplace.address,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image.pinataURL
      })
      setPurchases(purchasedItem)   
    }
  }
  setLoading(false)
  }



  function getData(val){
    setPrice(val.target.value)
  } 
  function getTime(val){
    setTime(val.target.value)
  }



  const SellItem = async (purchases) => {
  await(await nft.setApprovalForAll(purchases[0].marketplace, true)).wait()
  const listingPrice = ethers.utils.parseEther(price)
  const nftId = purchases[0].itemId.toString(); 
  await(await marketplace.makeItem(purchases[0].nft, nftId, listingPrice)).wait()
  setmodal(false)
  }


  const createAuction = async(purchases) =>{
    await(await nft.setApprovalForAll(purchases[0].marketplace,true)).wait()
    const listingPrice = ethers.utils.parseEther(price)
    const nftId = purchases[0].itemId.toString();
    const auctionTime=Time;
    await(await marketplace.createAuction(purchases[0].nft, nftId, listingPrice,auctionTime)).wait()
    setAuction(false)
  }

  const getPendingReturns = async(account)=>{
   const getbid=await marketplace.getPendingReturns(account);
   console.log("this is ",getbid.toString());
  }

  const withdraw = async(account)=>{
    await marketplace.withdraw(account);
  }

  useEffect(() => {
    loadPurchasedItems();
  },[])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (

    <div className="flex justify-center">
       <div>
    <Button onClick={()=>withdraw(account)} style={{ marginLeft: "1000px",marginTop: "5px" }}> Return Bids </Button>
    </div>
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                <Card.Img variant="top" src={item.image} />
                <Card.Footer>
                 {/* {ethers.utils.formatEther(item.totalPrice)} ETH  */}
                <div className='d-grid'>
                 <Button  onClick={() => setmodal(true)} variant="primary" size="lg" >
                 {/* onClick={() => SellItem(purchases)} */}
                  Sell 
                 </Button>
                 </div>
                 <br></br>
                 <div className='d-grid'>
                 <Button  onClick={() => setAuction(true)} variant="primary" size="lg" >
                 {/* onClick={() => SellItem(purchases)} */}
                  SetAuction 
                 </Button>
                 </div>
                </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
    <div>
    <Modal
    size='lg'
    isOpen={modal}
    toggle={() => setmodal(!modal)}>
    <ModalHeader
        toggle={() => setmodal(!modal)}>
            Set Price
        </ModalHeader>
    <ModalBody>
    <Form >
          <Row>        
          <div>
          <input 
          required type="number"
          className='form-control'
          placeholder='Enter Price'
          onChange={getData}></input> 
          </div>  
    <div>
    <Button onClick={()=>SellItem(purchases)} style={{ marginLeft: "200px",marginTop: "10px" }}> Submit </Button>
    </div>
          </Row>
    </Form>
    </ModalBody>
    </Modal>
    </div>  
<div>
    <Modal
    size='lg'
    isOpen={Auction}
    toggle={() => setAuction(!Auction)}>
    <ModalHeader
        toggle={() => setAuction(!Auction)}>
            Set Auction 
        </ModalHeader>
    <ModalBody>
    <Form >
          <Row>        
          <div>
          <input 
          required type="number"
          className='form-control'
          placeholder='Enter Price'
          onChange={getData}></input> 
          </div>  
      
          <div style={{ marginTop: "20px"}}>
          <input 
          required type="number"
          className='form-control'
          placeholder='Enter Time'
          onChange={getTime}></input> 
          </div> 
    <div>
    <Button onClick={()=>createAuction(purchases)} style={{ marginLeft: "200px",marginTop: "10px" }}> Submit </Button>
    </div>
          </Row>
    </Form>
    </ModalBody>
    </Modal>
    </div>

    </div>
        : ( 
          <main style={{ padding: "1rem 0" }}>
    <Button onClick={()=>withdraw(account)} style={{ marginLeft: "1000px",marginTop: "5px" }}> Return Bids </Button>

            <h2>No purchases</h2>
            <div>
    </div>
          </main>
        )}
    </div>
  );
}