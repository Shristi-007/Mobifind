var Roles = artifacts.require("../src/contracts/Roles.sol");
var ManufacturerContract = artifacts.require("../src/contracts/ManufacturerContract.sol");
var DistributorContract = artifacts.require("../src/contracts/DistributorContract");
var RetailerContract = artifacts.require("../src/contracts/RetailerContract");
var UserContract = artifacts.require("../src/contracts/UserContract");
var ServiceProviderContract = artifacts.require("../src/contracts/ServiceProviderContract.sol");
var GovernmentContract = artifacts.require("../src/contracts/GovernmentContract.sol");
var SupplyChain = artifacts.require("../src/contracts/SupplyChain.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Roles);
  await deployer.deploy(ManufacturerContract, Roles.address);
  await deployer.deploy(DistributorContract, Roles.address);
  await deployer.deploy(RetailerContract, Roles.address);
  await deployer.deploy(UserContract, Roles.address);
  await deployer.deploy(ServiceProviderContract, Roles.address);

  await deployer.deploy(
    GovernmentContract, 
    Roles.address, 
    ManufacturerContract.address, 
    DistributorContract.address, 
    RetailerContract.address,
    ServiceProviderContract.address,
    UserContract.address
    );

  await deployer.deploy(
    SupplyChain,
    Roles.address
    );
};