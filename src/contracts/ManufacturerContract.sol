// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.16;
import "./Roles.sol";

contract ManufacturerContract is Roles {
    Roles public rc;

    //event LogConstructorInitiated(string memory s);

    constructor(address _address) public {
        rc = Roles(_address);
        // emit LogConstructorInitiated(
        //     "Constructor was initiated. Call 'update()' to send the Provable Query."
        // );
    }

    struct Manufacturer {
        string name;
        string stateOfResidence;
        string hash;
        bool isEligible;
    }

    mapping(address => Manufacturer) public manufacturers;
    address[] public manufacturerAccounts;
    address[] public unverifiedManufacturerAccounts;

    modifier onlyGovernmentOfficial() {
        require(
            rc.getRole(tx.origin) == rc.governmentID(),
            "Only government officials can access"
        );
        _;
    }

    modifier onlyManufacturer() {
        require(rc.getRole(tx.origin) == rc.manufacturerRoleID());
        _;
    }

    function addManufacturer(
        string memory _name,
        string memory _stateOfResidence,
        string memory _hash
    ) public {
        Manufacturer storage manufacturer = manufacturers[tx.origin];
        manufacturer.name = _name;
        manufacturer.stateOfResidence = _stateOfResidence;
        manufacturer.hash = _hash;
        manufacturer.isEligible = false;

        unverifiedManufacturerAccounts.push(tx.origin);
    }

    function getManufacturers() public view returns (address[] memory) {
        return manufacturerAccounts;
    }

    function getManufacturer(
        address _address
    )
        public
        view
        returns (
            string memory _name,
            string memory _stateOfResidence,
            bool _isEligible
        )
    {
        require(
            manufacturers[_address].isEligible == true ||
                (_address == tx.origin ||
                    rc.getRole(tx.origin) == rc.governmentID()),
            "Unauthorised actor"
        );

        return (
            manufacturers[_address].name,
            manufacturers[_address].stateOfResidence,
            manufacturers[_address].isEligible
        );
    }

    function getState(address _address) external view returns (string memory) {
        return manufacturers[_address].stateOfResidence;
    }

    function countManufacturers() public view returns (uint256) {
        return manufacturerAccounts.length;
    }

    function getNumManufacturer(uint256 pos) public view returns (address) {
        return manufacturerAccounts[pos];
    }

    function getHash(
        address _address
    ) public view onlyGovernmentOfficial returns (string memory) {
        return manufacturers[_address].hash;
    }

    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0; i < unverifiedManufacturerAccounts.length; i++) {
            if (unverifiedManufacturerAccounts[i] == _address) {
                unverifiedManufacturerAccounts[
                    i
                ] = unverifiedManufacturerAccounts[
                    unverifiedManufacturerAccounts.length - 1
                ];
                delete unverifiedManufacturerAccounts[
                    unverifiedManufacturerAccounts.length - 1
                ];
                unverifiedManufacturerAccounts.length--;
                manufacturers[_address].isEligible = true;
                manufacturerAccounts.push(_address);
                rc.addRole(_address, rc.manufacturerRoleID());
                break;
            }
        }
    }

    function getUnverifiedManufacturers()
        public
        view
        onlyGovernmentOfficial
        returns (address[] memory)
    {
        return unverifiedManufacturerAccounts;
    }

    function getNumUnverifiedManufacturers()
        public
        view
        onlyGovernmentOfficial
        returns (uint256)
    {
        return unverifiedManufacturerAccounts.length;
    }

    function getUnverifiedManufacturer(
        uint256 pos
    ) public view onlyGovernmentOfficial returns (address) {
        return unverifiedManufacturerAccounts[pos];
    }
}
