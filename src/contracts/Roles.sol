pragma solidity ^0.5.16;

contract Roles {
    uint256 public constant manufacturerRoleID = 1;
    uint256 public constant distributorRoleID = 2;
    uint256 public constant retailerRoleID = 3;
    uint256 public constant userRoleID = 4;
    uint256 public constant serviceProviderRoleID = 5;
    uint256 public constant governmentID = 6;

    struct Role {
        uint256 roleID;
        bool roleSet;
    }

    mapping(address => Role) public role;

    function addRole(address _address, uint256 _RoleID) public {
        if (role[_address].roleSet == false)
            role[_address] = Role(_RoleID, true);
    }

    function getRole(address _address) public view returns (uint256) {
        if (role[_address].roleSet == true) return role[_address].roleID;
        else return 0;
    }

    function deleteRole(address _address) public {
        role[_address].roleSet = false;
        role[_address].roleID = 0;
    }
}
