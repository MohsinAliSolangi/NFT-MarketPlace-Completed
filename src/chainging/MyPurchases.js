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
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        nft: i.nft,
        tokenId: i.tokenId,
        marketplace: marketplace.address,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image.pinataURL
      }
      return purchasedItem      
    }))
    setLoading(false)
    setPurchases(purchases)
  }


  function getData(val){
    setPrice(val.target.value)
  }
  function getTime(val){
    setTime(val.target.value)
  }



  const SellItem = async (purchases) => {
  await(await nft.setApprovalForAll(marketplace.address, true)).wait()
  const listingPrice = ethers.utils.parseEther(price)
  const nftId = purchases[0].tokenId.toString(); 
  await(await marketplace.makeItem(nft.address, nftId, listingPrice)).wait()

  setmodal(false)
  }


  const createAuction = async(purchases) =>{
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    const listingPrice = ethers.utils.parseEther(price)
    const nftId = purchases[0].tokenId.toString();
    const auctionTime = Time;
    await(await marketplace.createAuction(nft.address, nftId, listingPrice,auctionTime)).wait()
    setAuction(false)
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (

    <div className="flex justify-center">
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

//yhan se main start kar rha han 


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
            <h2>No purchases</h2>
          </main>
        )}
    </div>
  );
}