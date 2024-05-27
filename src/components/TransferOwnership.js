import React, { useState, useEffect } from "react";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SupplyChain from "../abis/SupplyChain.json";

window.ethereum.on("accountsChanged", () => {
	window.location.reload();
});

export const TransferOwnership = () => {

    const account = useSelector(selectAccount);
	const web3 = useSelector(selectWeb3);
    const history = useHistory();
    const crypto = require('crypto');

    const [SupplyChainInstance, setSupplyChainInstance] = useState();
    const [id,setId] = useState();
    const [newOwner,setNewOwner]= useState();

    useEffect(() => {
		const initialize = async () => {
			try {
				const networkId = await web3.eth.net.getId();

				const deployedNetwork1 = SupplyChain.networks[networkId];
				const instance1 = new web3.eth.Contract(
					SupplyChain.abi,
					deployedNetwork1 && deployedNetwork1.address
					);
				setSupplyChainInstance(instance1);
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

    const transferOwnership = async (event) => {
        event.preventDefault();
        try{
        await SupplyChainInstance.methods.transferOwner(id,newOwner)
        .send({ from: account,
                gas: 999999,
		        gasPrice: 0
              });
            }
            catch(err){
                console.log(err);
            }
        console.log("Completed");
        history.push("/OfficialProfile");
    };

    return (
		<div style={{justifyContent:'center', marginTop:'50px'}}>
		<h4 style={{ textAlign: "center" }}>Account address: {account}</h4>
		<div className="container" style={{padding:"10px"}}>
		<div className="header" style={{margin:"50px"}}>Transfer Ownership</div>
		<form className="add-form" style={{height:"auto", display:'block'}}>

		<div className= "form-control" style={{height:'auto'}}>
		<label>Device ID</label>
		<input
		type="text"
		value={id}
		onChange={(e) => setId(e.target.value)}
		/>
        </div>
        <div className= "form-control" style={{height:'auto'}}>
		<label>New Owner Address</label>
		<input
		type="text"
		value={newOwner}
		onChange={(e) => setNewOwner(e.target.value)}
		/>
        </div>
        <button
		className="btn-grad"
		style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
		onClick={transferOwnership}
		>
		Submit
		</button>
		</form>
		</div>
		</div>
        );

};

