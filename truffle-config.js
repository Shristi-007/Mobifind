let HDWalletProvider = require("@truffle/hdwallet-provider");

//Provide your wallet private key
let privateKey = "0a886161c0e1e93b23618e2028072822d0179647f43a43b9572bf3f626e5b6d0";

//Provide your SKALE endpoint address
let skale = "https://testnet.skalenodes.com/v1/giant-half-dual-testnet:974399131";

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
