import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, ModalBody } from 'react-bootstrap'
// import {PriceModal} from './PriceModal'
// import React,{ useState } from "react"
import { Modal, ModalHeader,Form } from "reactstrap"
import { getValue } from '@testing-library/user-event/dist/utils'
//import { Price } from "./Price"

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [ItemsId, setItems] = useState([])
  const [modal, setmodal]= useState(false)
  const [price, setPrice]= useState(null)
  // const [Sale, setSale] = useState([])
  
  const loadPurchasedItems = async () => {
      
      const tokenCount = await nft.tokenCount()
  for(let i=1; i<=tokenCount;i++){

    // const uri = await nft.tokenURI(item.tokenId)
    // // use uri to fetch the nft metadata stored on ipfs
    // const response = await fetch(uri)
    // const metadata = await response.json()






      const ownerof = await nft.ownerOf(i) 
    
    
    if (account.toString().toLowerCase() == ownerof.toString().toLowerCase()){
  
     console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",i)
      setItems(i)
      const uri = await nft.tokenURI(i)
      
      // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",i)
      
      
      const purchasedItem = [];
      const test = uri.replace("https://gateway.pinata.cloud/","https://ipfs.io/ipfs/")
              const res = await fetch(test)//test
              const res2 = await res.json();
              const real = res2.image.pinataURL;
              const real2 = real.replace("https://gateway.pinata.cloud/","https://ipfs.io/")
     purchasedItem.push(real2);
      
     setPurchases(purchasedItem)

    
      }

    else{
      setLoading(false)
      console.log("you dont have any nft") 
    }
  
    }
  
    // const uri = await nft.tokenURI(2)

    // const ownerOf = await nft.ownerOf(account)
    // const response = await fetch(uri)
    // const metadata = await response.json()
    // console.log("this is metadata", ownerOf);






      // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
// 
//const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
//const results = await marketplace.queryFilter(filter)
      //Fetch metadata of each nft and add that to listedItem object.
//const purchases = await Promise.all(results.map(async i => {

  //     const purchases = await Promise.all(results.map(async i => {
  //     // fetch arguments from each result
  //     i = i.args
  //     // get uri url from nft contract
  //     const uri = await nft.tokenURI(i.tokenId)
  //     // use uri to fetch the nft metadata stored on ipfs 
  //     const response = await fetch(uri)
  //     const metadata = await response.json()
  //     // get total price of item (item price + fee)
  //    // const totalPrice = await marketplace.getTotalPrice(i.itemId)
  //     // define listed item object
  //     let purchasedItem = {
  //      //totalPrice,
  //     /*price: i.price,*/
  //       itemId: i.itemId,
  //       nft: i.nft,
  //       tokenId: i.tokenId,
  //       marketplace: marketplace.address,
  //       name: metadata.name,
  //       description: metadata.description,
  //       image: metadata.image.pinataURL
  //     }
  //     return purchasedItem      
  //   }))
  //   setLoading(false)
  //   setPurchases(purchases)    
    
  }


  function getData(val){
    setPrice(val.target.value)
  }

  
    const SellItem = async (ItemsId) => {
  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",ItemsId)
    
    
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    const listingPrice = ethers.utils.parseEther(price)
  await(await marketplace.makeItem(nft.address, ItemsId, listingPrice)).wait()
  setmodal(false)
  // setPurchases()
  // loadMarketplaceItems()
  }
  

  useEffect(() => {
    // console.log("this is nft Id,",purchases)
    loadPurchasedItems()
   
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      {/* <Button onClick={() => loadPurchasedItems()} variant="primary" size="lg">
                        NFTS
                      </Button> */}
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
                <Card.Img variant="top" src={item} />
                <Card.Footer>
                 {/* {ethers.utils.formatEther(item.totalPrice)} ETH  */}
                <div className='d-grid'>
                 <Button  onClick={() => setmodal(true)} variant="primary" size="lg" >
                 {/* onClick={() => SellItem(purchases)} */}
                  Sell 
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
    <Button onClick={()=>SellItem(ItemsId)} style={{ marginLeft: "200px",marginTop: "10px" }}> Submit </Button>
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
