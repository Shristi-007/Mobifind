// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./Roles.sol";
import "./HelperMethods.sol";

contract SupplyChain {
    Roles public rc;

    struct Product {
        string id;
        uint256 imei1;
        uint256 imei2;
        address ownerID;
        address manufacturerID;
        address distributorID;
        address retailerID;
        bool isValid;
        bool isBlocked;
        string reason;
    }

    mapping(string => Product) public products;
    mapping(address => string[]) public productsByManufacturer;
    uint256[] public blockedImeis;

    modifier onlyManufacturer() {
        require(
            rc.getRole(tx.origin) == rc.manufacturerRoleID(),
            "Only the manufacturer can perform this action"
        );
        _;
    }

    modifier onlyGovernment() {
        require(
            rc.getRole(tx.origin) == rc.governmentID(),
            "Only the government officials can perform this action"
        );
        _;
    }

    modifier validImei(uint256 imei) {
        require(checkImeiValidity(imei) == true, "Invalid IMEI number");
        _;
    }

    modifier onlyAuthorisedActor(address _address, string memory _id) {
        require(
            products[_id].ownerID == _address && products[_id].isValid,
            "Not an authorized actor or product not found."
        );
        _;
    }

    function checkImeiValidity(uint256 imei) public returns (bool) {
        uint32 count = 0;
        for (uint256 i = imei; i > 0; i /= 10) {
            if (i % 10 <= 9 || i % 10 >= 0) {
                count++;
            } else {
                return false;
            }
        }
        if (count == 15) return true;
        else return false;
    }

    function registerProduct(
        string memory _id,
        uint256 _imei1,
        uint256 _imei2
    ) public {
        // require(
        //     rc.getRole(msg.sender) == rc.manufacturerRoleID(),
        //     "Only the manufacturer can perform this action"
        // );

        Product memory product = products[_id];
        product.id = _id;
        product.imei1 = _imei1;
        product.imei2 = _imei2;
        product.ownerID = msg.sender;
        product.manufacturerID = msg.sender;
        product.isValid = true;
        product.isBlocked = false;
        product.reason = "";

        products[_id] = product;
        productsByManufacturer[msg.sender].push(_id);
    }

    function getProductCount(
        address _address
    ) public view onlyManufacturer returns (uint256) {
        return productsByManufacturer[_address].length;
    }

    function getProducts(
        address _address
    ) public view onlyManufacturer returns (string[] memory) {
        return productsByManufacturer[_address];
    }

    function getDetails(
        string memory _id
    )
        public
        returns (uint256, uint256, address, address, bool, bool, string memory)
    {
        return (
            products[_id].imei1,
            products[_id].imei2,
            products[_id].manufacturerID,
            products[_id].ownerID,
            products[_id].isValid,
            products[_id].isBlocked,
            products[_id].reason
        );
    }

    function blockProduct(
        string memory _productID,
        string memory _reason
    ) public {
        require(!products[_productID].isBlocked, "product is already blocked");
        products[_productID].isBlocked = true;
        products[_productID].reason = _reason;

        blockedImeis.push(products[_productID].imei1);
        blockedImeis.push(products[_productID].imei2);
    }

    // function unblockProduct(
    //     string memory _productID,
    //     string memory _reason
    // ) public onlyAuthorisedActor(msg.sender, _productID) {
    //     require(products[_productID].isBlocked, "product is not blocked");
    //     products[_productID].isBlocked = false;
    //     products[_productID].reason = _reason;
    //     removeImei(products[_productID].imei1);
    //     removeImei(products[_productID].imei2);
    // }

    function unblockProduct(
        string memory _productID,
        string memory _reason
    ) public {
        require(products[_productID].isBlocked, "product is not blocked");
        products[_productID].isBlocked = false;
        products[_productID].reason = _reason;
        removeImei(products[_productID].imei1);
        removeImei(products[_productID].imei2);
    }

    function removeImei(uint256 _imei) public {
        for (uint256 i = 0; i < blockedImeis.length; i++) {
            if (blockedImeis[i] == _imei) {
                blockedImeis[i] = blockedImeis[blockedImeis.length - 1];
                delete blockedImeis[blockedImeis.length - 1];
                blockedImeis.length--;
                break;
            }
        }
    }

    function transferOwner(string memory _id, address _address) public {
        products[_id].ownerID = _address;
    }
}
