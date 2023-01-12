import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, ModalBody } from 'react-bootstrap'
import { Modal, ModalHeader, Form } from "reactstrap"
import MintedBox from './MintedBox';




export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [load, setLoad] = useState(false);
  const [Bid, setBid] = useState(true);
  const [purchases, setPurchases] = useState([])
  const [chainId,setChainId] = useState()
  
  const getChainId = ()=> {
    const id = Number(window.ethereum.chainId)
    setChainId(id)
  }
  

  const loadPurchasedItems = async () => {
    try {
      const tokenCount = await nft.tokenCount()
      let purchasedItem = [];
      for (let i = 1; i <= tokenCount; i++) {
        const ownerof = await nft.ownerOf(i)
     if (account.toString().toLowerCase() == ownerof.toString().toLowerCase()) {

          const uri = await nft.tokenURI(i)
          // use uri to fetch the nft metadata stored on ipfs 
          const response = await fetch(uri)
          const metadata = await response.json()
          // get Royality fees 
          const royality = await nft.getRoyalityFees(i);
          const res = Number(royality.toString()) / 100
          // define listed item object
          console.log("&&&&&&&&",uri,res);       
        purchasedItem.push({
            nft: nft.address,
            itemId: i,
            marketplace: marketplace.address,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            Royality: res
          })
          setPurchases(purchasedItem)
        }
      }
      setLoading(false)

    }

    catch (error) {
      console.log(error)
    }
  }






  const getPendingReturns = async () => {
    try {
        const getbid = await marketplace.getPendingReturns(account);
        if (getbid > 0) {
            setBid(false);
            console.log("this is bid ",getbid.toString())
        }
    } catch (error) {
        console.log(error)
    }
}






  const withdraw = async (account) => {
    try {
      setLoad(true);
      await(await marketplace.withdraw(account)).wait();
      setLoad(false); 
      window.location.reload()
    } catch (error) {
      setLoad(false); 
      console.log(error);
    }

  }

  useEffect(()=>{
    getChainId()
  },[])

  useEffect(() => {
    loadPurchasedItems();
    getPendingReturns();
  }, [account])


  if(chainId ==5) {
  // if(chainId ==31337) {
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )
  }
 
  return (

    <div className="flex justify-center">
    <div>
        <Button onClick={() => withdraw(account)} style={{ marginLeft: "1000px", marginTop: "5px" }} disabled={Bid || load}> Return Bids </Button>
    </div>
      
      {purchases.length > 0 ?
        <div className="px-5 container">
           <Row xs={1} md={2} lg={3} className="g-4 py-5">
            {purchases.map((item, idx) => (

      <MintedBox item={item} idx={idx} loading = {load} nft={nft} marketplace={marketplace} account={account} />

            ))}
             
          </Row>

        </div>


     : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No purchases</h2>
            <div>
            </div>
          </main>
        )}
 </div>
  );
}