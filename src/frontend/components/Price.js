// import { useState } from 'react'
// import { ethers } from "ethers"
// import { Row, Form, Button, Modal } from 'react-bootstrap'
// import ModalHeader from 'react-bootstrap/esm/ModalHeader'
// // import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";

// //import { create as ipfsHttpClient } from 'ipfs-http-client'
// //const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// function PriceModel(){ 
// const [modal, setmodel]= useState(false)
// return(
// <div>
// <Modal
// size='lg'
// isOpen={modal}
// toggle={() => setmodal(!modal)}>

// <ModalHeader
//     toggle={() => setmodel(!modal)}>

//         PopUp
//     </ModalHeader>
// </Modal>

// </div>

// )
// }



// export default Price = (props) => {
//    const [price, setPrice] = useState(null)
   
//    const submit = (e)=>{

//     e.preventDefault();
//     props.onSet(price);
//    } 

  
//   return (
//     <div className="container-fluid mt-5">
//       <div className="row">
//         <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
//           <div className="content mx-auto">
//             <Row classNam>
//             <Form.Control value={setPrice(props.Price)} size="lg" required type="number" placeholder="Price in ETH" />
//               <div className="d-grid px-0">
//                 <Button onClick={submit} variant="primary" size="lg">
//                 Set
//                 </Button>
//               </div>
//             </Row>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

