import React, { useState } from "react";
import "./BlockIMEI.css";
import "../components/App.css";

export const DeviceStatus = () => {
   

    const [productID, setProductID] = useState("");
    return (
        <main className="container block-prod">
            <div className="header block-prod-header">Check Device Status</div>
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
                <button className="btn-grad block-imei-btn" onClick = {() => {window.open("/ViewStatus/" +productID, "_self");}}>
                Submit
            </button>
            </div>
        </main>
    );
};

