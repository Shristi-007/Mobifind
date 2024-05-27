import NavBar from "./Navbar/NavBar";
import UserContract from "../abis/UserContract.json";
import Roles from "../abis/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const UserProfile = () => {
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

    const getUser = async () => {
        const deployedNetwork = UserContract.networks[networkId];

        const instance = new web3.eth.Contract(
           UserContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getUser(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId === 4) {
                if (data === undefined) {
                    var result = await getUser();
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
        return <h1>Loading</h1>;
    } else {
        if (roleId === 4) {
            return (
                <div>
                <div className="profile">
                <h2>Consumer</h2>
                <p>Name: {data._name} </p>           
                <p>Contact: {data._contact}</p>
                </div>

                <div>
                <Link to="/BlockDevice" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                Block Device
                </button>
                </Link>
                 <Link to="/UnblockDevice" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                Unblock Device
                </button>
                </Link>
                 <Link to="/DeviceStatus" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                View Device Status
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