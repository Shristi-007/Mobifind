import React, { useState } from "react";
import NavBar from "../components/Navbar/NavBar";
// import "../App.css";
import TopCarousel from "../components/TopCarousel";
import Sidebar from "../components/Sidebar/Sidebar";
// import Popup from "../utils/Popup";
// import { Link } from 'react-router-dom';
// import getWeb3 from "../getWeb3";
// import ManufacturerContract from "../abis/ManufacturerContract.json";
// import DistributorContract from "../abis/DistributorContract.json";
// import RetailerContract from "../abis/RetailerContract.json";
// import UserContract from "../abis/UserContract.json";
// import GovernmentContract from "../abis/GovernmentContract.json";
// import SupplyChain from "../abis/SupplyChain.json";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const HomePage = () => {
//   const account = useSelector(selectAccount);
//   const web3 = useSelector(selectWeb3);

  const toggle = true;
  const isOpen = true;

//   var networkId;
//   var formDesign =
//   <div className="form-control">
//   <label>Address</label> 
//   <input
//   type="text"
//   onChange={(e) => setAddress(e.target.value)} />   
//   </div>;

//   var formDesign2 =
//   <div className="form-control">
//   <label>Crop Name</label>
//   <select className="drop-down" value={address} onChange={(e) => setAddress(e.target.value)}>
//   {
//     Object.entries(cropTypes).map(([key, value]) => {
//       return (
//         <option value={key}>{value}</option>
//         )
//     })          
//   }
//   </select>
//   </div>;

//   const getManufacturerDetails = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = ManufacturerContract.networks[networkId];

//     const instance = new web3.eth.Contract(
//       ManufacturerContract.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getManufacturer(address).call();
//     setData(obj);

//     setView1(true);
//   };

//   const getDistributorDetails = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = DistributorContract.networks[networkId];

//     const instance = new web3.eth.Contract(
//       DistributorContract.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getDistributor(address).call();
//     setData(obj);

//     setView2(true);
//   };

//   const getRetailerDetails = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = RetailerContract.networks[networkId];

//     const instance = new web3.eth.Contract(
//       RetailerContract.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getRetailer(address).call();
//     setData(obj);

//     setView3(true);
//   };

//   const getUserDetails = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = UserContract.networks[networkId];

//     const instance = new web3.eth.Contract(
//       UserContract.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getUser(address).call();
//     setData(obj);

//     setView4(true);
//   };

//   const getOfficialDetails = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = GovernmentContract.networks[networkId];

//     const instance = new web3.eth.Contract(
//       GovernmentContract.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getOfficial(address).call();
//     setData(obj);

//     setView6(true);
//   };

//   const getItemDetails = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = SupplyChain.networks[networkId];

//     const instance = new web3.eth.Contract(
//       SupplyChain.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getItems(address).call();
//     setData(obj);

//     setView7(true);
//   };

//   const getCropPricing = async (event) => {
//     event.preventDefault();

//     networkId = await web3.eth.net.getId();
//     const deployedNetwork = SupplyChain.networks[networkId];

//     const instance = new web3.eth.Contract(
//       SupplyChain.abi,
//       deployedNetwork && deployedNetwork.address
//       );

//     let obj = await instance.methods.getCropPrices(address).call();
//     setData(obj);

//     setView8(true);
//   };

  return (
    <div>
    <NavBar toggle={toggle} />
    <TopCarousel />
    </div>
);
};

export default HomePage;