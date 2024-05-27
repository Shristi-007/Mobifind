import NavBar from "./Navbar/NavBar";
import ManufacturerContract from "../abis/ManufacturerContract.json";
import Roles from "../abis/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const ManufacturerProfile = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [roleId, setRoleId] = useState();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    var networkId;

    const getRole = async () => {
        try {
            networkId = await web3.eth.net.getId();

            const deployedNetwork = Roles.networks[networkId];

            const instance = new web3.eth.Contract(
                Roles.abi,
                deployedNetwork && deployedNetwork.address
            );

            var _roleId = await instance.methods
                .getRole(account)
                .call();

            _roleId = _roleId.toNumber();
            setRoleId(_roleId);
        } catch (error) {
            alert(`Error while collecting General details`);
            console.error(error);
        }
    };

    const getManufacturer = async () => {
        const deployedNetwork = ManufacturerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ManufacturerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getManufacturer(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId === 1) {
                if (data === undefined) {
                    var result = await getManufacturer();
                    setData(result);
                } else {
                    setLoading(false);
                }
            }
        };

        initialize();
    }, [roleId, data]);

    console.log(loading);

    if (loading) {
        return <h3>Loading</h3>;
    } else {
        if (roleId === 1) {
            return (
                <div className="profile">
                <h2>Manufacturer</h2>
                <p>Name: {data._name} </p>           
                <p className="capitalize">State Of Residence: {data._stateOfResidence} </p>
                <div>
                <Link to="/RegisterDevice" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                Register Device
                </button>
                </Link>
                <Link to="/ViewDevices" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                View Registered Devices
                </button>
                </Link>
                <Link to="/BlockedImeis" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                View Blocked IMEIs
                </button>
                </Link>
                </div>

                </div>
            );
        } else {
            return (
                <div>
                <h2>Not authenticated</h2>
                <a href="/">Home</a>
                </div>
            );
        }
    }
};