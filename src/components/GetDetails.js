import React, {
    useState,
    useEffect
} from "react";
import {
    useParams
} from 'react-router';
import NavBar from "../components/Navbar/NavBar";
import "./App.css";
import ReactScrollableList from "react-scrollable-list";
import getWeb3 from "./getWeb3";
import ManufacturerContract from "../abis/ManufacturerContract.json";
import DistributorContract from "../abis/DistributorContract.json";
import RetailerContract from "../abis/RetailerContract.json";
import UserContract from "../abis/UserContract.json";
import GovernmentContract from "../abis/GovernmentContract.json";
import ServiceProviderContract from "../abis/ServiceProviderContract.json";

import {
    selectAccount,
    selectWeb3
} from "../redux/account/accountSlice";

import {
    useSelector
} from "react-redux";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});


export const GetDetails = (props) => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [data, setData] = useState();
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(true);

    var verified;

    const getManufacturerDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ManufacturerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ManufacturerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getManufacturer(props.match.params.id).call({ from: account });
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };

    const getDistributorDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DistributorContract.networks[networkId];

        const instance = new web3.eth.Contract(
            DistributorContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getDistributor(props.match.params.id).call({ from: account });
let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };

    const getRetailerDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = RetailerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            RetailerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getRetailer(props.match.params.id).call({ from: account });
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };

    const getUserDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = UserContract.networks[networkId];

        const instance = new web3.eth.Contract(
            UserContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        console.log("param");
        console.log(props.match.params.id);
       
        try{
        let obj = await instance.methods.getUser(props.match.params.id).call({ from: account });
        
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
        }
        catch(err){
            console.log(err);
        }
    };

    const getServiceProviderDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ServiceProviderContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ServiceProviderContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getServiceProvider(props.match.params.id).call({ from: account });
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };


    useEffect(() => {
        const initialize = async () => {
            var result;
            
            if (data === undefined) {
                if (props.match.params.role === "manufacturer") {
                    result = await getManufacturerDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                } else if (props.match.params.role === "distributor") {
                    result = await getDistributorDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                } else if (props.match.params.role === "retailer") {
                    result = await getRetailerDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                } else if (props.match.params.role === "serviceProvider") {
                    result = await getServiceProviderDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                }
                else if (props.match.params.role === "user") {
                    result = await getUserDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                }

            } else {
                setLoading(false);
                //console.log("Hello");
            }

        };

        initialize();
    }, [data]);


    const verifyUser = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = GovernmentContract.networks[networkId];

        const instance = new web3.eth.Contract(
            GovernmentContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        if (props.match.params.role === "manufacturer") {
            await instance.methods.setManufacturerAsEligible(props.match.params.id).send({ from: account });
        } else if (props.match.params.role === "distributor") {
            await instance.methods.setDistributorAsEligible(props.match.params.id).send({ from: account });
        } else if (props.match.params.role === "retailer") {
            await instance.methods.setRetailerAsEligible(props.match.params.id).send({ from: account });
        } else if (props.match.params.role === "serviceProvider") {
            await instance.methods.setServiceProviderAsEligible(props.match.params.id).send({ from: account });
        }
        else if (props.match.params.role === "user") {
            await instance.methods.setUserAsEligible(props.match.params.id).send({ from: account });
        }
        window.location.reload(false);
    }

    const viewIdCard = async () => {
        window.open(hash, '_blank');
    }

    if (loading) {
        return <h3>Loading</h3>;
    } else if (props.match.params.role === "manufacturer") {
        verified = data._isEligible ? "Yes" : "No";
        return (<div style={{marginTop: "100px"}}>
        	<div className="profile">
      <h2>Manufacturer</h2>
      <p>Name: {data._name} </p>           
      <p>State Of Residence: {data._stateOfResidence} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>
      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>      
      </div>);
    } else if (props.match.params.role === "distributor") {
        verified = data._isEligible ? "Yes" : "No";
        return (<div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>Distributor</h2>
      <p>Name: {data._name} </p>           
      <p>Contact: {data._contact}</p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();} }>
            Verify User
            </button>
      </div>

      </div>);
    } else if (props.match.params.role === "retailer") {
        verified = data._isEligible ? "Yes" : "No";
        return (<div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>Retailer</h2>
      <p>Name: {data._name} </p>           
      <p>Contact: {data._contact} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>
      </div>);
    } else if (props.match.params.role === "serviceProvider") {
        verified = data._isEligible ? "Yes" : "No";
        return (
            <div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>Service Provider</h2>
      <p>Provider Name: {data._name} </p> 
      <p>Contact: {data._contact} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>
      </div>
        );
    }
    else if (props.match.params.role === "user") {
        verified = data._isEligible ? "Yes" : "No";
        return (
            <div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>User</h2>
      <p>Name: {data._name} </p> 
      <p>Contact: {data._contact} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>
      </div>
        );
    }
};