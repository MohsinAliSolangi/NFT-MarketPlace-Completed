import { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import NftBox from './NftBox';


const Home = ({ getnft, getmarketplace, getContracts, marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [load, setLoad] = useState(false)
  const [chainId,setChainId] = useState()

  
  
  const loadMarketplaceItems = async () => {
    try {
      setLoading(true);
      // Load all unsold items
      const itemCount = await getmarketplace.itemCount()
      // console.log(itemCount.toString());
      let items = []
      for (let i = 1; i <= itemCount; i++) {
        const item = await getmarketplace.items(i)
        if (!item.sold) {
          const auction = await getmarketplace.isAuction(item?.tokenId?.toString())
          // console.log("this is nft ", auction)
          const time = await getmarketplace.getLastTime(item?.itemId?.toString())
          const temp = Number(time?.toString())
          // get uri url from nft contract
          const uri = await getnft.tokenURI(item?.tokenId)
          // use uri to fetch the nft metadata stored on ipfs
          const response = await fetch(uri)
          const metadata = await response.json()
          // get total price of item (item price + fee)
          //get Royality fees in %%%%%%%%%%
          const royality = await getnft.getRoyalityFees(item?.tokenId);
          const res = Number(royality?.toString()) / 100;
          items.push({
            time: temp,
            auction: auction,
            totalPrice: item?.price,
            itemId: item?.itemId,
            seller: item?.seller,
            name: metadata?.name,
            description: metadata?.description,
            image: metadata?.image,
            Royality: res

          })
        }
      }
      setLoading(false)
      setItems(items)
      
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

 
  useEffect(() => {
    loadMarketplaceItems();
  }, [])

  useEffect(() => {
    getContracts();
  }, [account])


  return (
    <div className="flex justify-center">
  
      {loading ? (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
      ) :
      items?.length > 0 ?
        <div className="px-5 container">
          <Row className="mt-5">
            {items?.map((item, idx) => (
              <NftBox item={item} idx={idx} setLoading = {setLoad} loading = {load} marketplace={marketplace} account={account} />
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