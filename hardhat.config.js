require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");



/** @type import('hardhat/config').HardhatUserConfig */
 

const PRIVATE_KEY = process.env.PRIVATE_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_APIKEY = process.env.COINMARKETCAP_APIKEY


module.exports = {
  solidity: {
    compilers : [
      {version : "0.8.8"},{version : "0.8.0"},{version : "0.6.6"}
    ] 
  },
  defaultNetwork : "hardhat",
  networks : {
    Goerli :{
      url : GOERLI_RPC_URL,
      accounts : [PRIVATE_KEY],
      chainId : 5,
      blockConfirmations : 6,
    },
    localhost :{
      url : "http://127.0.0.1:8545/",
      // ACCOUNTs - No Thankss
      chainId : 31337,

    }
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
        1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        // 1 is the chainId of the eth mainnet, here you can provide different account to different chians as deployer
    }
  },
  etherscan : {
    apiKey : ETHERSCAN_API_KEY,
  },
  // gasReporter : {
  //   enabled : true,
  //   outputFile : "gas-report.text",
  //   noColors : true,
  //   currency : "USD" ,
  //   coinmarketcap : COINMARKETCAP_APIKEY,
  //   token : 'MATIC',
  // }
}
