import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";

//import { create as ipfsHttpClient } from 'ipfs-http-client'
//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  //const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function OnChangeFile(e) {
    var file = e.target.files[0];

  
    if (typeof file !== 'undefined') {
      try {

        console.log("this is image file ",file);
        const resut = await uploadFileToIPFS(file);
        //const result = await client.add(file)
        console.log(resut)
        setImage(resut);
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  

  const createNFT = async () => {
    console.log("this is image ",image);  
    console.log("this is name ",name);  
    console.log("this is description ",description);  
   
    if (!image || !name || !description) return
  
    const nftJSON = {
      name, description, image
  }

    try{
     
      const result = await uploadJSONToIPFS(nftJSON)
      mintThenList(result)
      // console.log("this is url ",result);
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    // const temp = result.pinataURL.replace("https://gateway.pinata.cloud/ipfs/", "https://ipfs.io/ipfs/")
    // console.log("This is temp",temp)
    // const uri = `${temp}`
    // mint nft 
    //
    
    console.log("This is result.pinataURL",result.pinataURL);

    await(await nft.mint(result.pinataURL)).wait()
    // get tokenId of new nft 
    //const id = await nft.tokenCount()
    // approve marketplace to spend nft
    // await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // // add nft to marketplace
    // const listingPrice = ethers.utils.parseEther(price.toString())
    // console.log("this is id ", id.toString());
    // await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    // console.log("%%%%%%%%%%%%%%%%%%%%%",nft.address, id.toString(), listingPrice);
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={OnChangeFile}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              {/* <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" /> */}
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create