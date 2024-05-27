import React, { useEffect, useState } from "react";

import "./BlockIMEI.css";
import "../components/App.css";
import KeyValuePair from "../components/KeyValuePair";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

import SupplyChain from "../abis/SupplyChain.json";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

// string id;
// uint256 imei1;
// uint256 imei2;
// address ownerID;
// address manufacturerID;
// address distributorID;
// address retailerID;
// bool isValid;
// bool isBlocked;
// string reason;

export const ViewStatus = (props) => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [imei1, setImei1] = useState("12345678");
    const [imei2, setImei2] = useState("12345678");
    const [manufacturerID, setManufacturerID] = useState("0xaed34123");
    const [ownerID, setOwnerID] = useState("0xaed34123");
    const [isValid, setIsValid] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const [reason, setReason] = useState("Theft");

    // const getDetails = useCallback(async () => {
    //     try {
    //         throw "err";
    //         var networkId = await web3.eth.net.getId();

    //         const deployedNetwork = SupplyChain.networks[networkId];

    //         const instance = new web3.eth.Contract(
    //             SupplyChain.abi,
    //             deployedNetwork && deployedNetwork.address
    //         );

    //         const {
    //             imei1,
    //             imei2,
    //             manufacturerID,
    //             ownerID,
    //             isValid,
    //             isBlocked,
    //             reason,
    //         } = await instance.methods.getDetails(id).call();

    //         console.log(
    //             imei1,
    //             imei2,
    //             manufacturerID,
    //             ownerID,
    //             isValid,
    //             isBlocked,
    //             reason
    //         );

    //         setImei1(imei1.toNumber());
    //         setImei2(imei2.toNumber());
    //         setManufacturerID(manufacturerID);
    //         setOwnerID(ownerID);
    //         setIsValid(isValid);
    //         setIsBlocked(isBlocked);
    //         setReason(reason);
    //     } catch (error) {
    //         alert(`Error while collecting General details`);
    //         console.error(error);
    //     }
    // }, [id]);

    const getDeviceDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SupplyChain.networks[networkId];

        const instance = new web3.eth.Contract(
            SupplyChain.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods
            .getDetails(props.match.params.id)
            .call({ from: account });

        console.log("Implemented");
        obj[0] = obj[0].toNumber();
        obj[1] = obj[1].toNumber();
        console.log(obj);
        setImei1(obj[0]);
        setImei2(obj[1]);
        setOwnerID(obj[3]);
        setManufacturerID(obj[2]);
        setIsValid(obj[4]);
        setIsBlocked(obj[5]);
        setReason(obj[6]);
    };

    useEffect(() => {
        const initialize = async () => {
            await getDeviceDetails();
            console.log("Done");
        };
        initialize();
    }, []);

    return (
        <main className="block-imei container">
            <div className="block-imei header">View Status</div>
            <div className="block-imei-details">
                <div className="block-imei-details-left">
                    <KeyValuePair keyName="IMEI 1" value={imei1} />
                    <KeyValuePair keyName="IMEI 2" value={imei2} />
                    <KeyValuePair keyName="Owner ID" value={ownerID} />
                    <KeyValuePair
                        keyName="Manufacturer ID"
                        value={manufacturerID}
                    />
                </div>
                <div className="block-imei-details-right">
                    <KeyValuePair
                        keyName="Valid Account"
                        value={isValid ? "True" : "False"}
                    />
                    <KeyValuePair
                        keyName="Blocked Account"
                        value={isBlocked ? "True" : "False"}
                    />
                    <KeyValuePair keyName="Reason" value={reason} />
                </div>
            </div>
        </main>
    );
};
