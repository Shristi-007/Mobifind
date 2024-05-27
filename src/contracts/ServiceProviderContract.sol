// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.16;
import "./Roles.sol";
import "./HelperMethods.sol";

contract ServiceProviderContract {
    Roles public rc;

    constructor(address _address) public {
        rc = Roles(_address);
    }

    struct ServiceProvider {
        string name;
        string contact;
        string hash;
        bool isEligible;
    }

    mapping(address => ServiceProvider) public serviceProviders;
    address[] public serviceProviderAccounts;
    address[] public unverifiedServiceProviderAccounts;

    modifier onlyGovernmentOfficial() {
        require(
            rc.getRole(tx.origin) == rc.governmentID(),
            "Only government officials can access"
        );
        _;
    }

    modifier onlyAuthorisedActors(address _address) {
        require(
            serviceProviders[_address].isEligible == true ||
                (HelperMethods.compareStrings(
                    serviceProviders[_address].hash,
                    ""
                ) ==
                    false &&
                    (_address == tx.origin ||
                        rc.getRole(tx.origin) == rc.governmentID())),
            "Unauthorised actor"
        );
        _;
    }

    function addServiceProvider(
        string memory _name,
        string memory _contact,
        string memory _hash
    ) public {
        ServiceProvider storage serviceProvider = serviceProviders[tx.origin];
        serviceProvider.name = _name;
        serviceProvider.contact = _contact;
        serviceProvider.hash = _hash;
        serviceProvider.isEligible = false;

        unverifiedServiceProviderAccounts.push(tx.origin);
    }

    function getServiceProvider(
        address _address
    )
        public
        view
        onlyAuthorisedActors(_address)
        returns (string memory _name, string memory _contact, bool _isEligible)
    {
        return (
            serviceProviders[_address].name,
            serviceProviders[_address].contact,
            serviceProviders[_address].isEligible
        );
    }

    function getUnverifiedServiceProviderAccounts()
        public
        view
        onlyGovernmentOfficial
        returns (address[] memory)
    {
        return unverifiedServiceProviderAccounts;
    }

    function getNumUnverifiedServiceProviders()
        public
        view
        onlyGovernmentOfficial
        returns (uint256)
    {
        return unverifiedServiceProviderAccounts.length;
    }

    function getUnverifiedServiceProvider(
        uint256 pos
    ) public view onlyGovernmentOfficial returns (address) {
        return unverifiedServiceProviderAccounts[pos];
    }

    function countServiceProviders() public view returns (uint256) {
        return serviceProviderAccounts.length;
    }

    function getNumServiceProvider(uint256 pos) public view returns (address) {
        return serviceProviderAccounts[pos];
    }

    function getHash(
        address _address
    ) public view onlyGovernmentOfficial returns (string memory) {
        return serviceProviders[_address].hash;
    }

    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0; i < unverifiedServiceProviderAccounts.length; i++) {
            if (unverifiedServiceProviderAccounts[i] == _address) {
                unverifiedServiceProviderAccounts[
                    i
                ] = unverifiedServiceProviderAccounts[
                    unverifiedServiceProviderAccounts.length - 1
                ];
                delete unverifiedServiceProviderAccounts[
                    unverifiedServiceProviderAccounts.length - 1
                ];
                serviceProviders[_address].isEligible = true;
                rc.addRole(_address, rc.userRoleID());
                unverifiedServiceProviderAccounts.length--;
                serviceProviderAccounts.push(_address);
                break;
            }
        }
    }
}
