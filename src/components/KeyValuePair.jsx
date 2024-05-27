import React from "react";

const KeyValuePair = ({ keyName, value }) => {
    return (
        <div className="key-value-pair">
            <div className="key">{keyName}:</div>
            <div className="value">{value}</div>
        </div>
    );
};

export default KeyValuePair;
