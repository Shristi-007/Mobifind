import React, { useState, useEffect } from "react";
//import "../components/App.css";
import ManufacturerContract from "../abis/ManufacturerContract.json";
import DistributorContract from "../abis/DistributorContract.json";
import RetailerContract from "../abis/RetailerContract.json";
import UserContract from "../abis/UserContract.json";
import GovernmentContract from "../abis/GovernmentContract.json";
import ServiceProviderContract from "../abis/ServiceProviderContract.json";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";



window.ethereum.on("accountsChanged", () => {
	window.location.reload();
});

/*
Geocode.setApiKey("");
Geocode.setRegion("in");
Geocode.fromAddress("Delhi").then(
	(response) => {
		const { lat, lng } = response.results[0].geometry.location;
		console.log(lat, lng);
	},
	(error) => {
		console.error(error);
	}
	);
*/

export const RegisterPage = () => {
	const account = useSelector(selectAccount);
	const web3 = useSelector(selectWeb3);

	const [ManufacturerInstance, setManufacturerInstance] = useState();
	const [distributorInstance, setDistributorInstance] = useState();
	const [retailerInstance, setRetailerInstance] = useState();
	const [UserInstance, setUserInstance] = useState();
	const [ServiceProviderInstance, setServiceProviderInstance] = useState();
	const [governmentInstance, setGovernmentInstance] = useState();

	const [role, setRole] = useState("");
	const [name, setName] = useState("");
	const [stateOfResidence, setStateOfResidence] = useState("");
	const [contact, setContact] = useState("");
	const [empId, setEmpId] = useState("");
	const [fileState, setFileState] = useState(null);
	const [file,setFile] = useState("");
	const [url,setUrl] = useState("");

	const history = useHistory();

	//const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0' });


	
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

				const deployedNetwork4 = UserContract.networks[networkId];
				const instance4 = new web3.eth.Contract(
					UserContract.abi,
					deployedNetwork4 && deployedNetwork4.address
					);
				setUserInstance(instance4);

				const deployedNetwork5 = ServiceProviderContract.networks[networkId];
				const instance5 = new web3.eth.Contract(
					ServiceProviderContract.abi,
					deployedNetwork5 && deployedNetwork5.address
					);
				setServiceProviderInstance(instance5);

				const deployedNetwork6 = GovernmentContract.networks[networkId];
				const instance6 = new web3.eth.Contract(
					GovernmentContract.abi,
					deployedNetwork6 && deployedNetwork6.address
					);
				setGovernmentInstance(instance6);

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

	const addRole = async (event) => {
		event.preventDefault();
		var fileUpload;

		try{
			const fileData = new FormData();
			fileData.append("file",file);

			const responseData = await axios({
				method: "post",
				url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
				data: fileData,
				headers: {
					pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
					pinata_secret_api_key : process.env.REACT_APP_PINATA_SECRET_KEY,
					"Content-Type":"multipart/form-data",
				},

			});
			const fileUrl ="https://gateway.pinata.cloud/ipfs/"+responseData.data.IpfsHash;
			console.log(fileUrl);
			setUrl(fileUrl);
		}
		catch(err){
			console.log(err);
		}
		if (role === "Manufacturer") {
			//console.log("Manu");
			
					await ManufacturerInstance.methods
					.addManufacturer(name, stateOfResidence, url)
					.send({
						from: account,
						gas: 4712388,
						gasPrice: 0
					});	
					console.log("Done");		
		} else if (role === "distributor") {
			
			
			
					await distributorInstance.methods
					.addDistributor(name, contact, url)
					.send({
						from: account,
						gas: 4712388,
						gasPrice: 0
					});
		} else if (role === "retailer") {
			
					await retailerInstance.methods
					.addRetailer(name, contact, url)
					.send({
						from: account,
						gas: 4712388,
						gasPrice: 0
					});
		} else if (role === "User") {
			await UserInstance.methods
			.addUser(name, contact,url)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 0
			});
		} else if (role === "govt") {
			await governmentInstance.methods
			.addGovtOfficial(name, empId)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 0
			});
		} else if (role === "ServiceProvider") {
			
			
			
					await ServiceProviderInstance.methods
					.addServiceProvider(name, contact, url)
					.send({
						from: account,
						gas: 4712388,
						gasPrice: 0
					});
		}
		window.location.reload();
		history.push("/");
	};

	const captureFile = async (event) => {
		event.preventDefault();
		//const file = event.target.files[0];
		setFile(event.target.files[0]);
		// const reader = new window.FileReader();
		// reader.readAsArrayBuffer(file);
		// reader.onloadend = () => {
		// 	setFileState(Buffer(reader.result));
		// }
		
	};

	var options;
	if (role === "") {
		options = null;
	} else if (role === "Manufacturer") {
		options = <div>
		<div className= "form-control" style={{height:'auto'}}>
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className= "form-control" style={{height:'auto'}}>
		<label>State of Residence</label>
		<select className="drop-down"
		value={stateOfResidence}
		onChange={(e) => setStateOfResidence(e.target.value)}
		>
		<option value="">Select</option>
		<option value="kerala">Kerala</option>
		<option value="bihar">Bihar</option>
		<option value="andhrapradesh">Andhra Pradesh</option>
		<option value="telangana">Telangana</option>
		<option value="goa">Goa</option>
		<option value="maharasthra">Maharasthra</option>
		<option value="arunachalpradesh">Arunachal Pradesh</option>
		<option value="assam">Assam</option>
		<option value="chhattisgarh">Chhattisgarh</option>
		<option value="gujarat">Gujarat</option>
		<option value="haryana">Haryana</option>
		<option value="himachalpradesh">Himachal Pradesh</option>
		<option value="jharkhand">Jharkhand</option>
		<option value="karnataka">Karnataka</option>
		<option value="madhyapradesh">Madhya Pradesh</option>
		<option value="manipur">Manipur</option>
		<option value="meghalaya">Meghalaya</option>
		<option value="mizoram">Mizoram</option>
		<option value="nagaland">Nagaland</option>
		<option value="odisha">Odisha</option>
		<option value="punjab">Punjab</option>
		<option value="rajasthan">Rajasthan</option>
		<option value="sikkim">Sikkim</option>
		<option value="tamilnadu">Tamil Nadu</option>
		<option value="tripura">Tripura</option>
		<option value="uttarpradesh">Uttar Pradesh</option>
		<option value="uttarakhand">Uttarakhand</option>
		<option value="westbengal">West Bengal</option>
		</select>
		</div>

		<div>
		<label className="file-upload">Identity Card</label>
		<input type="file" onChange={captureFile} />
		</div>
		
		</div>;

	} else if (role === "distributor" || role === "retailer" || role==="User") {
		options = <div>
		<div className= "form-control" style={{height:'auto'}}>
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className= "form-control" style={{height:'auto'}}>
		<label>Contact details</label>
		<input
		type="text"
		value={contact}
		onChange={(e) => setContact(e.target.value)}
		/>
		</div>

		<div>
		<label className="file-upload">Identity Card</label>
		<input type="file" onChange={captureFile} />
		</div>

		</div>;
	} else if (role === "govt") {
		options = <div>
		<div className= "form-control" style={{height:'auto'}}>
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className= "form-control" style={{height:'auto'}}>
		<label>Employee ID</label>
		<input
		type="text"
		value={empId}
		onChange={(e) => setEmpId(e.target.value)}
		/>
		</div>
		</div>;
	} else if (role === "ServiceProvider") {
		options = <div>
		<div className= "form-control" style={{height:'auto'}}>
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className= "form-control" style={{height:'auto'}}>
		<label>Contact details</label>
		<input
		type="text"
		value={contact}
		onChange={(e) => setContact(e.target.value)}
		/>
		</div>

		<div>
		<label className="file-upload">Identity Card</label>
		<input type="file" onChange={captureFile} />
		</div>

		</div>;
	}

	return (
		<div style={{justifyContent:'center', marginTop:'50px'}}>
		<h4 style={{ textAlign: "center" }}>Account address: {account}</h4>
		<div className="container">
		<div className="header">Registration</div>
		<form className="add-form" style={{height:"auto", display:'block'}}>
		<div className= "form-control" style={{height:'auto'}} style={{height:'auto'}}>
		<label>Register As</label>
		<select className="drop-down"
		value={role}
		onChange={(e) => setRole(e.target.value)}
		>
		<option value="">Select</option>
		<option value="Manufacturer">Manufacturer</option>
		<option value="distributor">Distributor</option>
		<option value="retailer">Retailer</option>
		<option value="User">User</option>
		<option value="govt">Government Official</option>
		<option value="ServiceProvider">Service Provider</option>
		</select>
		</div>

		<div>
		{options}
		</div>

		<button
		className="btn-grad"
		style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
		onClick={addRole}
		>
		Submit
		</button>
		</form>
		</div>
		</div>
		);
};