import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, Form, ModalBody } from "reactstrap"
import { Row, Col, Card, Button } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { useNavigate } from "react-router-dom";

const MintedBox = ({ item, idx, marketplace, account,nft}) => {
    const [modal, setmodal] = useState(false)
    const [price, setPrice] = useState(null)
    const [Time, setTime] = useState(0)
    const [bid, setbid] = useState(0)
    const [bidder, setbidder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [load, setLoad] = useState(false);
    const [Bid, setBid] = useState(true);

    const [Auction, setAuction] = useState(false)
    const [chainId,setChainId] = useState()

    const navigate = useNavigate();




    const SellItem = async (item) => {
        try {
            setLoad(true);
            await (await nft.setApprovalForAll(item.marketplace, true)).wait()
            const listingPrice = ethers.utils.parseEther(price)
            const nftId = item.itemId.toString();
            await (await marketplace.makeItem(item.nft, nftId, listingPrice)).wait()
            setmodal(false);
            setLoad(false);
            window.location.reload()
        } catch (error) {
            setLoad(false);
            console.log(error)
        }

    }


    function getData(val) {
        setPrice(val.target.value)
      }
      function getTime(val) {
        setTime(val.target.value)
      }

    const createAuction = async (item) => {
        try {
            setLoad(true);
            await (await nft.setApprovalForAll(item.marketplace, true)).wait()
            const listingPrice = ethers.utils.parseEther(price)
            const nftId = item.itemId.toString();
            const auctionTime = Time;
            await (await marketplace.createAuction(item.nft, nftId, listingPrice, auctionTime)).wait()
            setAuction(false)
            setmodal(false);
            setLoad(false);
            window.location.reload()
        } catch (error) {
            setLoad(false);
            console.log(error)
        }
    }


// useEffect(() => {
//     // console.log(item);
// }, []);


return (
        <div>              
        <Col key={idx} className="overflow-hidden">
        <Card>
            <Card.Img variant="top" src={item.image} />
            <Card.Body color="secondary">
            <Card.Title>{item.name}</Card.Title>
                
                <Card.Text>
                    <hr/>
                      {item.description}

                </Card.Text>
                    <Card.Text>
                    <hr/>
                      {`Royality Fees ${item.Royality.toString()} %`}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                  
                    <div className='d-grid'>
                      <Button onClick={() => setmodal(true)} variant="primary" size="lg">
                        Sell
                      </Button>
                    </div>
                    <br></br>
                    <div className='d-grid'>
                      <Button onClick={() => setAuction(true)} variant="primary" size="lg" >
                        
                        SetAuction
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
        
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
                      <Button onClick={() => SellItem(item)} style={{ marginLeft: "200px", marginTop: "10px" }} disabled={load}> Submit </Button>
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

                    <div style={{ marginTop: "20px" }}>
                      <input
                        required type="number"
                        className='form-control'
                        placeholder='Enter Time'
                        onChange={getTime}></input>
                    </div>
                    <div>
                      <Button onClick={() => createAuction(item)} style={{ marginLeft: "200px", marginTop: "10px" }} disabled={load}> Submit </Button>
                    </div>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </div>

</div>
  )
}

export default MintedBox