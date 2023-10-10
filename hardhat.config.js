require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("dotenv").config();
require("solidity-coverage");
require("./tasks/account-details");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */

const url = process.env.SEPOLIA_RPC_URL;
const chainId = process.env.CHAIN_ID;
const privateKey = process.env.PRIVATE_KEY;
const etherScanApiKey = process.env.ETHERSCAN_API_KEY;
const coinmarketApi = process.env.MARKETCAP_API_KEY;
//hardhat chain id = 31337

module.exports = {
  solidity: "0.8.8",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: url,
      accounts: [privateKey],
      chainId: 11155111,
      blockConfirmations: 8,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //no need to put account id , it will automatically choose randomly from node
      chainId: 31337,
    },
    polygon: {
      url: "https://polygon.llamarpc.com",
      chianId: 137,
    },
  },
  etherscan: {
    apiKey: etherScanApiKey,
  },
  gasReporter: {
    enabled: true,
    //outputFile :"gas-reporter.txt",
    //noColors:true,
    currency: "USD",
    coinmarketcap: coinmarketApi,
    //token :"MATIC"  (for polygon , by default for ethererum)
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
};
