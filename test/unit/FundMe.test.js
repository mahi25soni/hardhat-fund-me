const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config.js")


!developmentChains.includes(network.name) ? 
describe.skip :
describe("FundMe", async function () {
    let fundme
    let mockv3aggregator
    let deployer

    const sendvalue = ethers.utils.parseEther("0.11")

    beforeEach(async function () {
        // const accounts = await ethers.getSigner() // return all acounts available for you network
        // const myacount = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"]) // deploy every script having tag 'all' and then getting the deployed tag in fundme in next line
        fundme = await ethers.getContract("FundMe", deployer)
        fundme = await ethers.getContract("FundMe", deployer)
        mockv3aggregator = await ethers.getContract("Agree", deployer)
        

    })
    describe("constructor", async function() {
        it ("sets the aggregator addresses correctly ", async function () {
        const response = await fundme.priceFeed(); // Address by normal chainlink
        assert.equal(response , mockv3aggregator.address) // Address by our method
        })
    })

    describe("fund", async function(){
        it ("Check whether there are enough eth", async function(){
            await expect(fundme.fund()).to.be.revertedWith("You need to spend more ETH!")
        })
        it ("abhi kuch bhi rkhle" , async function() {
            await fundme.fund({value : sendvalue})
            const response = await fundme.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendvalue.toString())
        })
        it ("ye funders ka hai" , async function() {
            await fundme.fund({value : sendvalue})
            const response = await fundme.funders(0)
            assert.equal(response.toString(), deployer.toString())

        })
    })

    describe("withdraw" , async function() {
        beforeEach(async function () {
            await fundme.fund({value : sendvalue})
        })

        it ("About withdraw function " , async function () {
            const preoffundme = await fundme.provider.getBalance(fundme.address) // we can also do ethers.provider.getBalance(fundme.address)
            const preofdeployer = await fundme.provider.getBalance(deployer)

            const transaction = await fundme.withdraw()
            const receipt = await transaction.wait(1)
            const { cumulativeGasUsed , effectiveGasPrice } = receipt
            const gasCost = cumulativeGasUsed.mul(effectiveGasPrice)

            const afteroffundme = await fundme.provider.getBalance(fundme.address)
            const afterofdeployer = await fundme.provider.getBalance(deployer)

            assert.equal (afteroffundme , 0)
            assert.equal (
                preoffundme.add(preofdeployer).toString(),
                afterofdeployer.add(gasCost).toString()
            )
        })

        it ("Getting funds from multiple funders ", async function () {
            const signers  = await ethers.getSigners()
            for(let i = 0; i < 7; i++){
                let tempContract = fundme.connect(signers[i])
                await tempContract.fund({ value : sendvalue })
            }
            const preoffundme = await fundme.provider.getBalance(fundme.address) 
            const preofdeployer = await fundme.provider.getBalance(deployer)

            const transaction = await fundme.withdraw()
            const receipt = await transaction.wait(1)
            const { cumulativeGasUsed , effectiveGasPrice } = receipt
            const gasCost = cumulativeGasUsed.mul(effectiveGasPrice)

            const afteroffundme = await fundme.provider.getBalance(fundme.address)
            const afterofdeployer = await fundme.provider.getBalance(deployer)

            assert.equal (afteroffundme , 0)
            assert.equal (
                preoffundme.add(preofdeployer).toString(),
                afterofdeployer.add(gasCost).toString()
            )

            // Make sure that funders and their value is zero after withdrawing
            await expect(fundme.funders(0)).to.be.reverted
            for(let i = 0; i < 7; i++){
                assert.equal(
                    await fundme.addressToAmountFunded(signers[i].address), 0
                )
            }
        })

        it ("is addressToAmountFunded empty? ", async function () {
            await fundme.withdraw()
            const response = await fundme.addressToAmountFunded(deployer)
            const answer = 0
            assert.equal(response.toString(), answer.toString())
        })
  
    })
})

