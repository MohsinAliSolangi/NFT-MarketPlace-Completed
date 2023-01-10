import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Modal, ModalHeader, Form, ModalBody } from "reactstrap"
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';
import NftBox from './NftBox';




const Home = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [modal, setmodal] = useState(false)
  const [price, setPrice] = useState(null)
  const [Time, setTime] = useState(0)
  const [bid, setbid] = useState(0)
  const [bidder, setbidder] = useState(null)
  const [NowTime, setNowTime] = useState(0)






  const loadMarketplaceItems = async () => {

    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    console.log("this is itme count+++++++++++++++", itemCount.toString());
    let items = []

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)

      if (!item.sold) {

        const auction = await marketplace.isAuction(item.tokenId.toString())
        console.log("this is nft ", auction)
        const time = await marketplace.getLastTime(item.itemId.toString())
        const temp = Number(time.toString())
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)

        //get Royality fees in %%%%%%%%%%
        const royality = await nft.getRoyalityFees(item.tokenId);
        const res = Number(royality.toString()) / 100;

        items.push({
          time: temp,
          auction: auction,
          totalPrice: item.price,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.pinataURL,
          Royality: res

        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    try {
      console.log("this is item id ", item.itemId.toString())
      await (await marketplace.purchaseItem(item.itemId.toString(), { value: item.totalPrice })).wait()
      loadMarketplaceItems()
    } catch (error) {
      console.log("this is error")
    }
  }

  // const isAuction = async () => {
  //   const auction = await marketplace.isAuction(items[0]?.itemId.toString())
  //   setAuction(auction)
  // }



  const getLastTime = async () => {
    const time = await marketplace.getLastTime(items[0]?.itemId.toString())
    const temp = Number(time.toString())
    const nowDate = Math.floor((new Date()).getTime() / 1000);
    setTime(temp)
    setNowTime(nowDate)
  }



  const getHigestBid = async () => {
    let bid = await marketplace.getHighestBid(items[0].itemId);
    setbid(ethers.utils.formatEther(bid))
    console.log("this is bid", bid.toString());
  }
  const getHigestBidder = async () => {
    let bidder = await marketplace.getHighestBidder(items[0].itemId);
    setbidder(bidder)
    console.log("this is bid", bidder.toString());
  }



  useEffect(() => {
    loadMarketplaceItems();
    getHigestBidder()
    getHigestBid()
  }, [])


  useEffect(() => {
    if (items.length > 0)
      getLastTime();
  }, [items]);

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row className="mt-5">
            {items.map((item, idx) => (
              <NftBox item={item} idx={idx} marketplace={marketplace} nft={nft} account={account} />
            ))}
          </Row>


        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home