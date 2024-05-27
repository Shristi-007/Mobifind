// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.16;
import "./Roles.sol";
import "./HelperMethods.sol";

contract UserContract {
    Roles public rc;

    constructor(address _address) public {
        rc = Roles(_address);
    }

    struct User {
        string name;
        string contact;
        string hash;
        bool isEligible;
    }

    mapping(address => User) public users;
    address[] public userAccounts;
    address[] public unverifiedUserAccounts;

    modifier onlyGovernmentOfficial() {
        require(
            rc.getRole(tx.origin) == rc.governmentID(),
            "Only government officials can access"
        );
        _;
    }

    modifier onlyAuthorisedActors(address _address) {
        require(
            users[_address].isEligible == true ||
                (HelperMethods.compareStrings(users[_address].hash, "") ==
                    false &&
                    (_address == tx.origin ||
                        rc.getRole(tx.origin) == rc.governmentID())),
            "Unauthorised actor"
        );
        _;
    }

    function addUser(
        string memory _name,
        string memory _contact,
        string memory _hash
    ) public {
        User storage user = users[tx.origin];
        user.name = _name;
        user.contact = _contact;
        user.hash = _hash;
        user.isEligible = false;

        unverifiedUserAccounts.push(tx.origin);
    }

    function getUser(
        address _address
    )
        public
        view
        returns (string memory _name, string memory _contact, bool _isEligible)
    {
        require(
            users[_address].isEligible == true ||
                (_address == tx.origin ||
                    rc.getRole(tx.origin) == rc.governmentID()),
            "Unauthorised actor"
        );

        return (
            users[_address].name,
            users[_address].contact,
            users[_address].isEligible
        );
    }

    function getUnverifiedUserAccounts()
        public
        view
        onlyGovernmentOfficial
        returns (address[] memory)
    {
        return unverifiedUserAccounts;
    }

    function getNumUnverifiedUsers()
        public
        view
        onlyGovernmentOfficial
        returns (uint256)
    {
        return unverifiedUserAccounts.length;
    }

    function getUnverifiedUser(
        uint256 pos
    ) public view onlyGovernmentOfficial returns (address) {
        return unverifiedUserAccounts[pos];
    }

    function countUsers() public view returns (uint256) {
        return userAccounts.length;
    }

    function getNumUser(uint256 pos) public view returns (address) {
        return userAccounts[pos];
    }

    function getHash(
        address _address
    ) public view onlyGovernmentOfficial returns (string memory) {
        return users[_address].hash;
    }

    function setEligible(address _address) public onlyGovernmentOfficial {
        for (uint256 i = 0; i < unverifiedUserAccounts.length; i++) {
            if (unverifiedUserAccounts[i] == _address) {
                unverifiedUserAccounts[i] = unverifiedUserAccounts[
                    unverifiedUserAccounts.length - 1
                ];
                delete unverifiedUserAccounts[
                    unverifiedUserAccounts.length - 1
                ];
                users[_address].isEligible = true;
                rc.addRole(_address, rc.userRoleID());
                unverifiedUserAccounts.length--;
                userAccounts.push(_address);
                break;
            }
        }
    }
}
