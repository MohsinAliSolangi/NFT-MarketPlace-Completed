import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";


const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [royality, setRoyality] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function OnChangeFile(e) {
    var file = e.target.files[0];


    if (typeof file !== 'undefined') {
      try {

        console.log("this is image file ", file);
        const resut = await uploadFileToIPFS(file);
        //const result = await client.add(file)
        console.log(resut)
        setImage(resut);
      } catch (error) {
        console.log("ipfs image upload error: ", error)
      }
    }
  }


  const createNFT = async () => {

    console.log("this is image ", image);
    console.log("this is name ", name);
    console.log("this is description ", description);

    if (!image || !name || !description) return

    const nftJSON = {
      name, description, image
    }

    try {

      const result = await uploadJSONToIPFS(nftJSON)
      mintThenList(result)

    } catch (error) {
      console.log("ipfs uri upload error: ", error)
    }
  }

  const mintThenList = async (result) => {
    try {
      await (await nft.mint(result.pinataURL, royality)).wait()
    } catch (error) {
      console.log(error)
    }
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
              <Form.Control onChange={(e) => setRoyality(e.target.value)} size="lg" required type="number" placeholder="Royality Fees in %" />
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