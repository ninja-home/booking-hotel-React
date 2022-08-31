import * as React from 'react';
import {Button, Modal} from 'react-bootstrap';
import Navbar from './Navbar';

export default function RoomList({rooms, hotelContract, account}) {

    const [state, setState] = React.useState({
        roomId: null,
        show: false,
        tenantNumOfNights: null
    });

    const web3 = window.web3;
    const roomItems = rooms.sort((a, b) => {
        return b.id - a.id;
    });

    const bookRoom = async (event) => {
        event.preventDefault();
        const web3 = window.web3;
        let amount;
        const bookingDetails = {
            id: state.roomId,
            numOfNights: event.target.numOfNights.value
        }
        console.log("Selected Number Of Nights", bookingDetails.numOfNights, bookingDetails.id);
        const selectedRoomItem = await hotelContract.methods.roomItemId(state.roomId).call()
        .then(async (room) => {
            console.log("room", room);
            amount = await room.pricePerNight * bookingDetails.numOfNights.toString();
            console.log("Calculated Price", amount);
        }).catch((err) => {
            console.log(err);
        })

        const result = await hotelContract.methods.bookRoom(
            bookingDetails.id,
            bookingDetails.numOfNights
        ).send({
            from:account,
            value: amount,
            gas: 1500000,
            gasPrice:'30000000000'
        }, (err, hash) => {
            if (err) {
                console.log(err);
                window.alert("Error booking room");
            } else {
                console.log(hash);
                window.alert("Room Booked Successfully");
                window.location.reload();
                closeModal();
            }
        })
    }

    const closeModal = async () => {
        setState((prev) => ({...prev, show:false}));
    }

    const showModal = async (event) => {
        setState((prev) => ({...prev, roomId: event.target.id}));
        setState((prev) => ({...prev, show:true}));
        console.log("Current Room ID", state.roomId);
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 mb-2'>
                    <div className='card'>
                        <div className='card-header'><div className='card-title'>Rooms</div></div>
                        <div className='card-body'>
                            <div className='table-responsive'>
                                <table className='table table-sm table-hover table-bordered table-dark'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th>Id</th>
                                            <th>Hotel Id</th>
                                            <th>Name</th>
                                            <th>Total Beds</th>
                                            <th>Price Per Night</th>
                                            <th>Room Number</th>
                                            <th>Description</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                    roomItems.map((room)=> 
                                        <tr key={room.id.toString()}>
                                            <td>{Number.parseInt(room.id.toString())}</td>
                                            <td>{Number.parseInt(room.hotelId.toString())}</td>
                                            <td>{room.name}</td>
                                            <td>{Number.parseInt(room.totalBeds.toString())}</td>
                                            <td>{web3.utils.fromWei(room.pricePerNight.toString(), "ether")} ETH</td>
                                            <td>{Number.parseInt(room.number.toString())}</td>
                                            <td>{room.description}</td>
                                            <td>{room.isBooked === false && 
                                            <Button variant="primary" onClick={showModal} id={Number.parseInt(room.id.toString())} className='btn btn-sm btn-primary'
                                            disabled={room.user===account}>Book Room</Button>}
                                            {room.isBooked===true && 
                                            <Button variant="danger" className="btn btn-sm btn-primary" disabled>Booked</Button>
                                            }
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={state.show} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Room Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <form onSubmit={bookRoom}>
                            <div className='form-group row mb-2'>
                                <label for="numOfNights" className='col-sm-6 col-form-label'>Number of Nights</label>
                                <div className='col-md-6'>
                                    <input type="number" className="form-control"
                                        name="numOfNights"
                                        id="numOfNights"
                                        placeholder='Total No Of Nights'
                                        required
                                        onChange={(event)=>setState((prev) => ({...prev, tenantNumOfNights: event.target.value}))}></input>
                                </div>
                            </div> 
                            <Modal.Footer>
                                <Button variant="danger" onClick={closeModal}>
                                    cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={!state.tenantNumOfNights || state.tenantNumOfNights <= 0}>
                                    Confirm Booking
                                </Button>
                            </Modal.Footer>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}