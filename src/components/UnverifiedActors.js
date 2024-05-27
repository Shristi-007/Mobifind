import React, {
    useState,
    useEffect
} from "react";
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
    Link
} from 'react-router-dom';

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

export const UnverifiedActors = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState("");

    const [manufacturerInstance, setManufacturerInstance] = useState();
    const [distributorInstance, setDistributorInstance] = useState();
    const [retailerInstance, setRetailerInstance] = useState();
    const [serviceProviderInstance, setServiceProviderInstance] = useState();
    const [userInstance, setUserInstance] = useState();

    var scrollListItems = [];
    var option;

    useEffect(() => {
        const initialize = async () => {
            try {
                const networkId = await web3.eth.net.getId();

                const deployedNetwork1 = ManufacturerContract.networks[networkId];
                const instance1 = new web3.eth.Contract(
                    ManufacturerContract.abi,
                    deployedNetwork1 && deployedNetwork1.address
                );
                setManufacturerInstance(instance1);

                const deployedNetwork2 = DistributorContract.networks[networkId];
                const instance2 = new web3.eth.Contract(
                    DistributorContract.abi,
                    deployedNetwork2 && deployedNetwork2.address
                );
                setDistributorInstance(instance2);

                const deployedNetwork3 = RetailerContract.networks[networkId];
                const instance3 = new web3.eth.Contract(
                    RetailerContract.abi,
                    deployedNetwork3 && deployedNetwork3.address
                );
                setRetailerInstance(instance3);

                const deployedNetwork4 = ServiceProviderContract.networks[networkId];
                const instance4 = new web3.eth.Contract(
                    ServiceProviderContract.abi,
                    deployedNetwork4 && deployedNetwork4.address
                );
                setServiceProviderInstance(instance4);

                const deployedNetwork5 = UserContract.networks[networkId];
                const instance5 = new web3.eth.Contract(
                    UserContract.abi,
                    deployedNetwork5 && deployedNetwork5.address
                );
                setUserInstance(instance5);

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`
                );
                console.error(error);
            }
        };

        initialize();
    }, []);

    const getUnverifiedManufacturers = async () => {

        let len = await manufacturerInstance.methods.getNumUnverifiedManufacturers().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await manufacturerInstance.methods.getUnverifiedManufacturer(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
        console.log("listitems"+ listItems.length);
        // ListItem({listItems});
        // console.log("running");
    };

    const getUnverifiedDistributors = async () => {

        let len = await distributorInstance.methods.getNumUnverifiedDistributors().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await distributorInstance.methods.getUnverifiedDistributor(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
    };

    const getUnverifiedRetailers = async () => {

        let len = await retailerInstance.methods.getNumUnverifiedRetailers().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await retailerInstance.methods.getUnverifiedRetailer(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
        
    };

    const getUnverifiedServiceProviders = async () => {

        let len = await serviceProviderInstance.methods.getNumUnverifiedServiceProviders().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await serviceProviderInstance.methods.getUnverifiedServiceProvider(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
        
    };

    const getUnverifiedUsers = async () => {

        let len = await userInstance.methods.getNumUnverifiedUsers().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
          
            let val = await userInstance.methods.getUnverifiedUser(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
        
    };
    // const getUnverifiedColdStorages = async () => {

    //     let len = await serviceProviderInstance.methods.getNumUnverifiedColdStorages().call({
    //         from: account
    //     });

    //     let listItems = [];
    //     for (let i = 0; i < len; i++) {
    //         let val = await serviceProviderInstance.methods.getUnverifiedColdStorage(i).call({
    //             from: account
    //         });
    //         listItems.push(val);
    //     }

    //     setData(listItems);
    // };

    function ListItem({ d }) {
        const [checked, setChecked] = useState(false);
        return (<li onClick = {() => {window.open("/GetDetails/" + choice + "/" + d.content, "_self");}}> 
            {d.content} 
            </li>);
    }

    function List() {
        return (<ol className="unverified-list"> {
            scrollListItems.map((d) => {
                return <ListItem d = { d } />;
            })
        } </ol>);
    }


    const viewActors = async () => {
        if (choice === "manufacturer") {
            await getUnverifiedManufacturers();
        } else if (choice === "distributor") {
            await getUnverifiedDistributors();
        } else if (choice === "retailer") {
            await getUnverifiedRetailers();
        } else if (choice === "serviceProvider") {
            await getUnverifiedServiceProviders();
        } else if (choice === "user") {
            console.log("user");
            await getUnverifiedUsers();
        }

    };

    scrollListItems = [];
    for (let i = 0; i < data.length; i++) {
        scrollListItems.push({
            id: i,
            content: data[i]
        });
    }

    if (scrollListItems.length === 0)
        return (<div className="container">
            <h3 style={{textAlign:"center"}}> Select which unverified users you want to view </h3> 
            <div className="containerOuter">
            <div className="containerInner" value = {choice} onChange = { (e) => setChoice(e.target.value) } >

            <input type = "radio" className="hidden" id="input1" value = "manufacturer" name = "role" /> 
            <label class="entry" for="input1"><div class="circle"></div><div class="entry-label">Manufacturer</div></label>

            <input type = "radio" className="hidden" id="input2" value = "distributor" name = "role" /> 
            <label class="entry" for="input2"><div class="circle"></div><div class="entry-label">Distributor</div></label>

            <input type = "radio" className="hidden" id="input3" value = "retailer" name = "role" /> 
            <label class="entry" for="input3"><div class="circle"></div><div class="entry-label">Retailer</div></label> 

            <input type = "radio" className="hidden" id="input5" value = "user" name = "role" />
            <label class="entry" for="input5"><div class="circle"></div><div class="entry-label">User</div></label>

            <input type = "radio" className="hidden" id="input4" value = "serviceProvider" name = "role" />
            <label class="entry" for="input4"><div class="circle"></div><div class="entry-label">Service Provider</div></label> 
            <div class="highlight"></div>
            <div class="overlay"></div>
            </div>
            </div>
            <button className = "btn-grad" style = {{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }} onClick = {viewActors}> Submit </button>

            </div>);

    else
        return (
            <div> 
            <List/> 
            </div>

        );
};