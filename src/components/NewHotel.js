import * as React from 'react';
import { Button, Modal} from 'react-bootstrap';
import useIpfs from '../hooks/useIpfs';
import {Buffer} from 'buffer';
import ipfs from '../ipfs';

export default function NewHotel(props) {

    const [state, setState] = React.useState({
        imageBuffer: null,
        ipfsImageHash: null,
        show:false

    })

//    const {ipfs, ipfsInitError} = useIpfs();

    const capturePhoto = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async() => {
            setState((prev) => ({...prev, imageBuffer: Buffer(reader.result) }));
            console.log("Image Buffer: ", Buffer(reader.result));
            await fetchImageHash(Buffer(reader.result));
        }
    }

    const fetchImageHash = async (imageBuffer) => {
        const {path} = await ipfs.then((IPFS, err) => {
            try {
                return IPFS.add(imageBuffer);
            } catch(err) {
              console.log(err);
            }            
          });
          setState((prev) => ({...prev, ipfsImageHash: path}));
          console.log(path);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const web3 = props.provider;
        const fee = props.listingFee;
        const account = props.account;
        const hotelContract = props.hotelContract;

        const hotel = {
            name: event.target.name.value,
            location: event.target.location.value,
            description:event.target.description.value,
        }
        
        const tx = await hotelContract.methods.addHotel(
            hotel.name,
            hotel.description,
            hotel.location,
            state.ipfsImageHash
            ).send({
                from: account,
                value: web3.utils.toWei(fee.toString(),"ether"),
                gas: 1500000,
                gasPrice: '30000000000'
            }, (err, hash) => {
                if (err) {
                    console.log(err);
                    window.alert("Error adding hotel");
                    
                }
                else {
                    console.log("Image Hash after file upload", state.ipfsImageHash);
                    console.log(hash);
                    window.alert("Hotel Added Successfully");
                    window.location.reload();
                    closeModal();
                }
            });
    }

    const clearForm = async (event) => {
        event.preventDefault();
    }

    const closeModal = async () => {
        setState((prev) => ({...prev, show: false }));
    }

    const showModal = async () => {
        setState((prev) => ({...prev, show: true }));
    }

    return(
        <div className="container mb-2">
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <Button onClick={showModal} style={{ "backgroundColor":"#FFAO7A", "color":"#fff"}}>
                        List Hotel
                    </Button>
                    <Modal show={state.show} onHide={closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title> List Hotel</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row col-md-12">
                                <p>By Confirming your hotel listing, you agree to our terms and conditions on paying a listing fee of <b>{props.listingFee}</b> ETH</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group row mb-2">
                                    <label htmlFor="name" className="col-sm-6 col-form-label">Name: </label>
                                    <div className="col-sm-6">
                                        <input type="text" className="form-control" name="name" id="name" placeholder="Hotel Name" required></input>
                                    </div>
                                </div>
                                <div className="form-group row mb-2">
                                    <label htmlFor="location" className="col-sm-6 col-form-label">Location: </label>
                                    <div className="col-sm-6">
                                        <input type="text" className="form-control" name="location" id="location" placeholder="Hotel Location" required></input>
                                    </div>
                                </div>
                                <div className="form-group row mb-2">
                                    <label htmlFor="description" className="col-sm-6 col-form-label">Description: </label>
                                    <div className="col-sm-6">
                                        <textarea className="form-control" id="description" name="description" placeholder="Hotel Description" required></textarea>
                                    </div>
                                </div>
                                <div className="form-group row mb-2">
                                    <label htmlFor="file" className="col-sm-6 col-form-label">Photo</label>
                                    <div className="col-sm-6">
                                        <input type="file" onChange={capturePhoto} accept=".jpg, .png, .svg" name="image" id="image" placeholder="Upload File" required />
                                    </div>
                                </div>
                            
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={!state.ipfsImageHash}>
                                        Confirm Listing
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Body>
                        
                    </Modal>
                </div>
                <div className="col-md-2"></div>
            </div>
            <div className="row">
            </div>
        </div>
    )
}
