const { assert } = require("chai")
const { ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config.js")

developmentChains.includes(network.name) ? 
describe.skip :
describe ("Fundme", async function () {
    let fundme
    let deployer
    let sendvalue = await ethers.utils.parseEther("0.11")

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundme = await ethers.getContract("FundMe", deployer)
    })

    it ("Allows people to fund and withdraw", async function() {
        await fundme.fund({ value : sendvalue})
        await fundme.withdraw()
        const endvalue = await fundme.provider.getBalance(fundme.address)
        assert.equal(endvalue.toString(), "0")
    })

})