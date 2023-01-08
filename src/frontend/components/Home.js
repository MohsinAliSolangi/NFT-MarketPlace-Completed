import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import { Modal, ModalHeader, Form, ModalBody } from "reactstrap"
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';




const Home = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  //  const [Auction, setAuction] = useState(false)
  const [modal, setmodal] = useState(false)
  const [price, setPrice] = useState(null)
  const [Time, setTime] = useState(0)
  const [NowTime, setNowTime] = useState(0)

  //const [currAddress, updateCurrAddress] = useState("0x0")

  const loadMarketplaceItems = async () => {

    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    console.log("this is itme count+++++++++++++++",itemCount.toString());
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
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // console.log("###################",item)
        // console.log("$$$$$$$$$$$$$ this is account address",account)
        // Add item to items array
        items.push({
          time: temp,
          auction: auction,
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.pinataURL

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

  const placeBid = async () => {
    const bidding = ethers.utils.parseEther(price)
    marketplace.bid(items[0].itemId, { value: bidding })
    setmodal(false)
  }

  const CancelListing = async () => {
    marketplace.cancelListing(items[0].itemId)

  }

  function getData(val) {
    setPrice(val.target.value)
  }

  const getLastTime = async () => {
    const time = await marketplace.getLastTime(items[0]?.itemId.toString())
    const temp = Number(time.toString())
    const nowDate = Math.floor((new Date()).getTime() / 1000);
    setTime(temp)
    setNowTime(nowDate)
  }

  const concludeAuction = async () => {
    marketplace.concludeAuction(items[0].itemId.toString(), account)
  }


  useEffect(() => {
    loadMarketplaceItems();
  }, [])


  useEffect(() => {
    if (items.length > 0)
      getLastTime();
  }, [items]);

  console.log(items, NowTime)

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description}
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
            ))}
          </Row>
          <div>
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
                      <Button onClick={() => placeBid(items[0].itemId)} style={{ marginLeft: "200px", marginTop: "10px" }}> Submit </Button>
                    </div>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </div>


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