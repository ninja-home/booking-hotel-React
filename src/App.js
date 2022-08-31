import * as React from 'react';
import Navbar from './components/Navbar.js';
import PageLoader from './components/PageLoader.js';
import RoomList from './components/RoomList.js';
import HotelList from './components/HotelList';
import './App.css';
import useIpfs from './hooks/useIpfs.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { constants } from 'buffer';
import Web3 from 'web3';
import HotelContract from '../src/abi/Booking.json';

function App() {
  
  const [state, setState] = React.useState({
    account:'',
    hotelContractABI: null,
    totalHotels: null,
    totalRooms: null,
    hotels: [],
    rooms: [],
    hotelListingFee: null,
    isLoading: true,
    provider: null,
    networkId: null,
  });
  
  React.useEffect(()=>{
    const fetchData = async () => {
      await loadWeb3();
      await loadBlockchain();
    }
    fetchData();
  },[state.hotels.length]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      setState((prev) => ({...prev, provider: window.web3}));
      await window.ethereum.request({method: 'eth_requestAccounts'});
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      setState((prev) => ({...prev, provider: window.web3}));
    } else {
      window.alert("Non-Ethereum browser detected, please consider installing MetaMask Extension for your browser");     
    }
  };

  const loadBlockchain = async () => {
    let totalNumberOfHotels;
    let totalNumberOfRooms;
    const web3 = window.web3;
    
    const accounts = await web3.eth.getAccounts().then((accounts) => {
      setState((prev) => ({...prev, account: accounts[0]}));
    }).catch((err) => console.error(err));

    window.ethereum.on('accountsChanged', async(accounts) => {
      setState((prev) => ({...prev, account: accounts[0]}));
      window.location.reload();
    });

    const networkID = await web3.eth.net.getId();
    setState((prev) => ({...prev, networkId: networkID}));

    window.ethereum.on('chainChanged', async (netId) => {
      setState((prev) => ({...prev, networkId: netId}));
      window.location.reload();
    })
    const hotelContractData = HotelContract.networks[networkID];

    if (hotelContractData){
      //set the contract ABI
      
      const hotelContract = await new web3.eth.Contract(HotelContract.abi, hotelContractData.address);
      setState((prev) => ({...prev, hotelContractABI: hotelContract }));

      //fetch total Number of hotels
      await hotelContract.methods.totalHotels().call().then((total) => {

        totalNumberOfHotels = Number.parseInt(total.toString());  
        setState((prev) => ({...prev, totalHotels: totalNumberOfHotels }));
        console.log("totalNumberOfHotels", totalNumberOfHotels);
      }).catch((err) => {
        console.log(err);
      });

      await hotelContract.methods.totalRooms().call().then(( total ) => {
        totalNumberOfRooms = Number.parseInt(total.toString());
        setState((prev) => ({...prev, totalRooms: totalNumberOfRooms }));
        console.log("totalNumberOfRooms", totalNumberOfRooms);
      }).catch((err) => console.log(err));

      const fetchHotels = async () => {
        let result = [];
        for (let i = 0; i < totalNumberOfHotels; i++) {
          await hotelContract.methods.hotelItems(i).call().then((hotel) => {
            result.push(hotel);
          }).catch((err) => {
            console.log(err);
          });
        }
        setState(prev => ({...prev,
          hotels: result
        }));

      }
    
      const fetchRooms = async () => {
        let result = [];
        for(let i = 0; i < totalNumberOfRooms; i++){
          await hotelContract.methods.roomItemId(i+1).call()
            .then((data) => {
              result.push(data);
            }).catch((err) => {
              console.log(err);
            });
        }
        if (totalNumberOfRooms > 0) {
          setState(prev => ({...prev,
            rooms: result
          }));
        }
      }
    
      const fetchListingFee = async () => {
        const web3 = window.web3;
        (await hotelContract.methods.hotelListingFee()).call().then((fee) => {
          const feeAmount = web3.utils.fromWei(fee.toString(), "ether");
          setState((prev) => ({...prev, hotelListingFee: feeAmount }));
          console.log("fff", feeAmount);
        }).catch((err) => {
          console.log(err);
        });
      }
      // let listingFee;
      // listingFee = await hotelContract.methods.hotelListingFee().call();
      // setState((prev) => ({...prev, hotelListingFee: listingFee}));
      const fetchBookings = async() =>{
        let totalBookings;
        await hotelContract.methods.totalBookings().call().then(res => {
          totalBookings = Number.parseInt(res.toString());
          console.log("total Bookings", totalBookings);
        });
        totalBookings = Number.parseInt(totalBookings.toString());
        let result = [];
//        for (let i = 0; i<totalBookings; i++) {
          if (totalBookings) await hotelContract.methods.getRoomBioData(1).call().then((res) => result.push(res))
  //      }
        if (totalBookings > 0) {
          console.log("bookings:", result);
        }
      }
      await fetchRooms();
      await fetchHotels();
      await fetchListingFee();

      
      await fetchBookings();
      setState((prev) => ({...prev, isLoading: false }));
    }else{
      setState((prev) => ({...prev, isLoading: true }));
      window.alert("Kindly switch your network to Polygon Mumbai Testnet");
    }
  };

  return (    
    <>
      <Navbar account={state.account} />
      {state.isLoading ? (
        <div className="text-center page-loader">
            <PageLoader />
          <p className="text-center"> Feteching hotels...</p>
        </div>
      ): (
        <div>
          <RoomList rooms={state.rooms} 
          hotelContract = {state.hotelContractABI} 
          account = {state.account}/>

          <HotelList hotelContract={state.hotelContractABI}
            totalHotels={state.totalHotels}
            listingFee={state.hotelListingFee}
            hotels={state.hotels}
            account={state.account}
            provider={state.provider} />
        </div>
      )}
    </>
  )
  
}

export default App;

// WARNING in ./node-modules/@chainsafe/libp2p-gossipsub/dist/src/constants.js
// Module warning (from ./node_modules/source-map-loader/dist/cjs.js):

