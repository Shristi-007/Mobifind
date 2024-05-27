import React, { useState, useEffect } from "react";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SupplyChain from "../abis/SupplyChain.json";

window.ethereum.on("accountsChanged", () => {
	window.location.reload();
});

export const RegisterDevice = () => {

    const account = useSelector(selectAccount);
	const web3 = useSelector(selectWeb3);
    const history = useHistory();
    const crypto = require('crypto');

    const [SupplyChainInstance, setSupplyChainInstance] = useState();
    const [imei1, setImei1] = useState();
    const [imei2, setImei2]= useState();

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

    const registerDevice = async (event) => {
        event.preventDefault();

        const id = imei1+' '+imei2;
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(id, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        console.log(encrypted);

        try{
        await SupplyChainInstance.methods.registerProduct(encrypted,imei1,imei2)
        .send({ from: account,
                gas: 999999,
		        gasPrice: 0
              });
            }
            catch(err){
                console.log(err);
            }
        console.log("Completed");
        history.push("/ManufacturerProfile");
    };

    return (
		<div style={{justifyContent:'center', marginTop:'50px'}}>
		<h4 style={{ textAlign: "center" }}>Account address: {account}</h4>
		<div className="container" style={{padding:"10px"}}>
		<div className="header" style={{margin:"50px"}}>Register Device</div>
		<form className="add-form" style={{height:"auto", display:'block'}}>

		<div className= "form-control" style={{height:'auto'}}>
		<label>Enter IMEI 1</label>
		<input
		type="number"
		value={imei1}
		onChange={(e) => setImei1(e.target.value)}
		/>
        </div>
        <div className= "form-control" style={{height:'auto'}}>
		<label>Enter IMEI 2</label>
		<input
		type="number"
		value={imei2}
		onChange={(e) => setImei2(e.target.value)}
		/>
        </div>
        <button
		className="btn-grad"
		style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
		onClick={registerDevice}
		>
		Submit
		</button>
		</form>
		</div>
		</div>
        );

};

