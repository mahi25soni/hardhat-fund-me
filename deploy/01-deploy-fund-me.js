// function something(hre){
//     console.log('heieoie')
// } 
// module.exports = something // You can write like this OR


// module.exports = async (hre) => {
  //     console.log('chlan bey')
  // }                    // both are same
  
  // Since we added 4 fields to hre that are getNamedAccounts, getUnnamedAccounts, deploments, getChainId. We can also write as
const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify.js")
require("dotenv").config()

function me(){
  
}

module.exports = async ({getNamedAccounts, getUnnamedAccounts, deployments, getChainId}) => {

    const { deploy,log ,get} = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
   
    var ethUsdPriceAddress
    if (developmentChains.includes(network.name)){
      const agree = await get("Agree")
      ethUsdPriceAddress = agree.address
    }
    else{
      ethUsdPriceAddress =  networkConfig[chainId]["ethUsdPriceFeed"]

    }
    const argsu = [ethUsdPriceAddress]
    const fundme = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        args: argsu,  // Extra argumetns, mostly constructor argument of a contract
        log: true,
        waitConfirmations : network.config.blockConfirmations
      });
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundme.address, argsu)
    }

    log('--------------------------------------------------'
    )
    
} 

module.exports.tags= ["all","fundme"]