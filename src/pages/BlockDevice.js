import React, { useState } from "react";
import "./BlockIMEI.css";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import SupplyChain from "../abis/SupplyChain.json";

export const BlockDevice = () => {
    const account = useSelector(selectAccount);
	const web3 = useSelector(selectWeb3);

    const [reason, setReason] = useState("");
    const [productID, setProductID] = useState("");

    const blockIMEI = async () => {
        var networkId = await web3.eth.net.getId();

        const deployedNetwork = SupplyChain.networks[networkId];

        const instance = new web3.eth.Contract(
            SupplyChain.abi,
            deployedNetwork && deployedNetwork.address
        );

        await instance.methods.blockProduct(productID, reason).send({
						from: account,
						gas: 4712388,
						gasPrice: 0
					});
    };

    return (
        <main className="container block-prod">
            <div className="header block-prod-header">Block Device</div>
            <div className="block-prod-details">
                <div className="form-control" style={{ height: "auto" }}>
                    <label>Product ID</label>
                    <input
                        type="text"
                        placeholder="Product ID"
                        value={productID}
                        onChange={(e) => {
                            setProductID(e.target.value);
                        }}
                    />
                </div>
                <div className="form-control" style={{ height: "auto" }}>
                    <label>Reason</label>
                    <select
                        className="drop-down"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="theft">Theft</option>
                        <option value="lost">Lost Device</option>
                        <option value="non-functional">
                            Device not in functional state
                        </option>
                    </select>
                </div>
                <button className="btn-grad block-imei-btn" onClick={blockIMEI}>
                Submit
            </button>
            </div>
        </main>
    );
};

