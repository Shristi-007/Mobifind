// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.16;
import "./Roles.sol";
import "./ManufacturerContract.sol";
import "./DistributorContract.sol";
import "./RetailerContract.sol";
import "./UserContract.sol";
import "./ServiceProviderContract.sol";

contract GovernmentContract {
    Roles public rc;
    ManufacturerContract public mc;
    DistributorContract public dc;
    RetailerContract public rtc;
    ServiceProviderContract public spc;
    UserContract public uc;

    constructor(
        address _address,
        address _mcAddress,
        address _dcAddress,
        address _rtcAddress,
        address _spcAddress,
        address _uc
    ) public {
        rc = Roles(_address);
        mc = ManufacturerContract(_mcAddress);
        dc = DistributorContract(_dcAddress);
        rtc = RetailerContract(_rtcAddress);
        spc = ServiceProviderContract(_spcAddress);
        uc = UserContract(_uc);
    }

    struct GovtOfficial {
        string name;
        string govId;
    }

    mapping(address => GovtOfficial) public govt;
    address[] public govtAccounts;

    function addGovtOfficial(string memory _name, string memory _govId) public {
        GovtOfficial storage govtOfficial = govt[tx.origin];
        govtOfficial.name = _name;
        govtOfficial.govId = _govId;

        govtAccounts.push(tx.origin);
        rc.addRole(tx.origin, rc.governmentID());
    }

    function getOfficial(
        address _address
    ) public view returns (string memory _name, string memory _govId) {
        return (govt[_address].name, govt[_address].govId);
    }

    function setManufacturerAsEligible(address _address) public {
        mc.setEligible(_address);
    }

    function setDistributorAsEligible(address _address) public {
        dc.setEligible(_address);
    }

    function setRetailerAsEligible(address _address) public {
        rtc.setEligible(_address);
    }

    function setServiceProviderAsEligible(address _address) public {
        spc.setEligible(_address);
    }

    function setUserAsEligible(address _address) public {
        uc.setEligible(_address);
    }

    function countOfficials() public view returns (uint256) {
        return govtAccounts.length;
    }

    function getNumOfficial(uint256 pos) public view returns (address) {
        return govtAccounts[pos];
    }
}
