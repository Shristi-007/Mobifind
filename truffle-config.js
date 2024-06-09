let HDWalletProvider = require("@truffle/hdwallet-provider");

//Provide your wallet private key
let privateKey = "";

//Provide your SKALE endpoint address
let skale = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet:12345678";

module.exports = {
    networks: {
        ganache: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        skale: {
            provider: () => new HDWalletProvider(privateKey, skale),
            gasPrice: 0,
            network_id: "*"
        }
    },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
