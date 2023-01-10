import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, Form, ModalBody } from "reactstrap"
import { Row, Col, Card, Button } from 'react-bootstrap'
import Countdown from 'react-countdown'

const NftBox = ({ item, idx, marketplace, nft, account }) => {
  const [modal, setmodal] = useState(false)
  const [price, setPrice] = useState(null)
  const [Time, setTime] = useState(0)
  const [bid, setbid] = useState(0)
  const [bidder, setbidder] = useState(null)
  const [NowTime, setNowTime] = useState(0)

  const getLastTime = async () => {
    try {
      const time = await marketplace.getLastTime(item.itemId.toString())
      const temp = Number(time.toString())
      const nowDate = Math.floor((new Date()).getTime() / 1000);
      setTime(temp)
      setNowTime(nowDate)
    } catch (error) {
      console.log(error);
    }
  }

  const getHigestBid = async () => {
    try {

      let bid = await marketplace.getHighestBid(item.itemId);
      setbid(ethers.utils.formatEther(bid))
      console.log("this is bid", bid.toString());

    } catch (error) {
      console.log(error);
    }
  }

  const getHigestBidder = async () => {
    try {
      let bidder = await marketplace.getHighestBidder(item.itemId);
      setbidder(bidder)
      console.log("this is bid", bidder.toString());
    } catch (error) {
      console.log(error);
    }

  }

  const CancelListing = async () => {
    try {
      marketplace.cancelListing(item.itemId);
    } catch (error) {
      console.log(error);
    }


  }

  const concludeAuction = async () => {
    try {
      marketplace.concludeAuction(item.itemId, account);
    } catch (error) {
      console.log(error);
    }

  }

  const buyMarketItem = async (item) => {
    try {
      console.log("this is item id ", item.itemId.toString())
      await (await marketplace.purchaseItem(item.itemId.toString(), { value: item.totalPrice })).wait()
      // loadMarketplaceItems()
    } catch (error) {
      console.log(error);
    }
  }


  const placeBid = async () => {
    try {
      const bidding = ethers.utils.parseEther(price)
      marketplace.bid(item.itemId, { value: bidding })
      setmodal(false);
    } catch (error) {
      console.log(error);
    }

  }

  function getData(val) {
    setPrice(val.target.value)
  }


  console.log("MOdal ", modal)

  useEffect(() => {
    getLastTime();
    getHigestBid();
    getHigestBidder();
  }, [bidder, bid]);


  return (
    <div className="flex justify-center">
      <Col lg={4} key={idx} className="overflow-hidden">
        <Card>
          <Card.Img variant="top" src={item.image} />
          <Card.Body color="secondary">
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>
              {item.description}

            </Card.Text>
            <Card.Text>
              {`Highest Bid : ${bid} ETH`}

            </Card.Text>
            <Card.Text>
              {`Highest Bidder : ${bidder?.slice(0, 5)}...${bidder?.slice(bidder.length - 4)}`}
            </Card.Text>

            <Card.Text>
              {`Royality Fees ${item.Royality.toString()} %`}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <div className='d-grid'>
              {item.time > 0
                ?
                NowTime < Time
                  ? <div className='d-grid'><Button onClick={() => setmodal(true)} variant="primary" size="lg"> Place Bid </Button>
                    <Countdown date={Time * 1000} /></div>
                  : <div className='d-grid'><button onClick={() => concludeAuction()} variant="primary" size="lg" >GetNFT</button></div>
                : account.toString().toLowerCase() === item.seller.toString().toLowerCase()
                  ? <Button onClick={() => CancelListing(item)} variant="primary" size="lg">
                    Cancel Listing
                  </Button>
                  : <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                    Buy NFT
                    {ethers.utils.formatEther(item.totalPrice)} ETH
                  </Button>
              }

            </div>
          </Card.Footer>
        </Card>
      </Col>


      <Modal
        size='lg'
        isOpen={modal}
        toggle={() => setmodal(!modal)}>
        <ModalHeader
          toggle={() => setmodal(!modal)}>
          Place Bid
        </ModalHeader>
        <ModalBody>
          <Form >
            <Row>
              <div>
                <input
                  required type="number"
                  className='form-control'
                  placeholder='Enter Bid'
                  onChange={getData}></input>
              </div>
              <div>
                <Button onClick={() => placeBid(item.itemId)} style={{ marginLeft: "200px", marginTop: "10px" }}> Submit </Button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>


  )
}

export default NftBox