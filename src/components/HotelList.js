import * as React from 'react';
import {Button, Modal} from 'react-bootstrap';
// import Web3 from 'web3';
// import HotelItem from './HotelItem';
import NewHotel from './NewHotel';
// import {BrowserRouter, Route, Routes, Link} from 'react-router-dom';

export default function HotelList({hotels, totalHotels, listingFee, account, provider, hotelContract}) {

    const [state, setState] = React.useState({
        isLoading:true,
        currentHotelId: null,
        hotel: {},
        show: false,
        selectedHotelId: null
    });

    // const fetchHotelBioData = async (event) => {
    //     event.preventDefault();
    //     let currentHotelID = event.target.id;
    //     setState((prev) => ({...prev, currentHotelId: currentHotelID}));

    //     const fetchRooms = async () => {
    //         await hotelContract.methods.listRooms().call().then((data) => {
    //             for (let i = 0; i < data.length; i++) {
    //                 if (data[i].hotelId === state.currentHotelId) {
    //                     state.hotel.rooms.push(data[i]);
    //                     console.log("Rooms Found:", state.hotel.rooms);
    //                 } else {
    //                     console.log("This hotel has no rooms");
    //                 }
    //             }
    //         }).catch((error) => {
    //             console.error(error);
    //         });
    
    //     }

    //     await hotelContract.methods.getHotelBioData(currentHotelID).call().then((result) => {
    //         if (result) {
    //             const hotel = {
    //                 id: result._id,
    //                 name: result._name,
    //                 totalRooms: result._totalRooms,
    //                 dateOfCreation: result._date,
    //                 category: result._category,
    //                 location: result._location,
    //                 imageHash: result._photo,
    //                 description: result._description,
    //                 rooms: []
    //             };
    //             setState((prev) => ({...prev, hotel:hotel}));

    //             fetchRooms();
    //         }
    //     })
    // }

    const closeModal = async () => {
        setState((prev) => ({...prev, show:false}));
    }

    const showModal = async (event) => {
        event.preventDefault();
        setState((prev) => ({...prev, selectedHotelId: event.target.id}));
        setState((prev) => ({...prev, show:true}));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const web3 = window.web3;
        const roomItem = {
            name: event.target.name.value,
            hotelId: state.selectedHotelId,
            totalBeds: event.target.total_beds.value,
            pricePerNight: await web3.utils.toWei(event.target.price_per_night.value.toString(), 'ether'),
            number: event.target.room_number.value,
            description: event.target.description.value
        }

        await hotelContract.methods.addRoom(
            roomItem.hotelId,
            roomItem.totalBeds,
            roomItem.pricePerNight,
            roomItem.number,
            roomItem.name,
            roomItem.description
        ).send({
            from: account,
            gas: 1500000,
            gasPrice: '30000000000'
        }, (err, hash) => {
            if (err) {
                window.alert("Error adding room");
                console.log(err);
            } else {
                console.log(hash);
                window.alert("Room Added Successfully");
                window.location.reload();
                closeModal();
            }
        });
    }
    const showAlert = async (event) => {
        event.preventDefault();
        window.alert("Comming Soon");
    }

    const Hotels = hotels.sort((a, b) => {
        return b.id - a.id;
    })
    
    return (
        <div className='container mb-2'>
            <h6>Total Hotels: {totalHotels} </h6>
            <h6>Listing Fee: {listingFee} ETH</h6>
            <NewHotel hotelContract={hotelContract}
                    listingFee={listingFee}
                    account={account}
                    provider={provider}
                />
            <div className='row'>
                {Hotels.map((hotel) => 
                    <div key={hotel.id.toString()} className='col-md-4 mr-2 mb-2'>
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">{ hotel.name }</div>
                                </div>
                                <div className="card-body">
                                    <img src={`https://ipfss.infura-ipfs.io/ipfs/${hotel.imageHash}`} alt="hotel image" style={{ width: '100%', height: '200px'}} className="mb-3 img-thumbnail"></img>
                                    <p>Location: {hotel.locationAddress}</p>
                                    <p>Descrition: {hotel.description}</p>
                                    <p>Number Of Rooms: {Number.parseInt(hotel.totalRooms.toString())}</p>
                                    <p>Published By: {hotel.user}</p>
                                    <p>Hotel Type: {hotel.hotelCategory == 0 ? "Chain Hotel":""}</p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Button className="btn btn-success btt-sm" onClick={showAlert} id={hotel.id}> View </Button>
                                        </div>
                                        <div className="col-md-6">
                                            {account === hotel.user &&
                                                <Button variant="primary" onClick={showModal} id={hotel.id}>
                                                    Add Room
                                                </Button>
                                            }
                                            { account !== hotel.user &&
                                                <Button variant="info" onClick={showAlert}> View Rooms </Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                )}
            </div>

            <Modal show={state.show} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group row mb-2">
                                <label htmlFor="name" className="col-sm-6 col-form-label">Name: </label>
                                <div className="col-sm-6">
                                    <input type="text" className="form-control" name="name" id="name" placeholder="Room Name"></input>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label htmlFor="hotel_id" className="col-sm-6 col-form-label">Hotel Id:</label>
                                <div className="col-md-6">
                                    <input type="number" disabled value={state.selectedHotelId} className="form-control" name="hotel_id" id="hotel_id" placeholder="Total No Of Rooms"></input>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label htmlFor="price_per_night" className="col-sm-6 col-form-label">Price Per Night:</label>
                                <div className="col-md-6">
                                    <input type="number" className="form-control" name="price_per_night" id="price_per_night" placeholder="Total No Of Rooms" step="any"></input>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label htmlFor="total_beds" className="col-sm-6 col-form-label">Total Beds:</label>
                                <div className="col-md-6">
                                    <input type="number" className="form-control" name="total_beds" id="total_beds" placeholder="Total No Of Rooms"></input>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label htmlFor="room_number" className="col-sm-6 col-form-label">Number:</label>
                                <div className="col-md-6">
                                    <input type="number" className="form-control" name="room_number" id="room_number" placeholder="Total No Of Rooms"></input>
                                </div>
                            </div>
                            <div className="form-group row mb-2">
                                <label htmlFor="description" className="col-sm-6 col-form-label">Description: </label>
                                <div className="col-sm-6">
                                    <textarea className="form-control" id="description" name="description" placeholder="Hotel Description"></textarea>
                                </div>
                            </div>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeModal}>
                                    Close
                                </Button>
                                <Button type="submit" variant="primary">
                                    Add Room
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal.Body>
            </Modal>

        </div>
    )
}