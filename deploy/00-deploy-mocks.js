
const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const DECIMALS = "8";
const INITIAL_ANSWER = "200000000000";

module.exports = async ({getNamedAccounts, getUnnamedAccounts, deployments, getChainId}) => {

    const { deploy,log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    
    if (chainId == 31337){
    await deploy("Agree",{
        contract: "@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol:MockV3Aggregator",
        from: deployer,
        log: true,
        args: [DECIMALS, INITIAL_ANSWER],  // Extra argumetns, mostly constructor argument of a contract
        });
    }
}

 

module.exports.tags= ["all","mocks"]