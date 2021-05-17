const Web3 = require("web3")
const hre = require("hardhat")
const assert = require('assert')

const ballotJSON = require("../artifacts/contracts/BallotGarageISEP.sol/BallotGarageISEP.json")

const utils = require("../src/utils")

describe("garageisep ballot test suite", function (){
    let web3
    let accounts
    let contract
    let time
    let sendContrFunc = utils.sendContrFunc
    let deployContract = utils.deployContract
    let strToBytes32 = utils.strToBytes32

    this.timeout(20000)

    before(async function (){
        hre.run("node")
        await delay(500)
        web3 = new Web3("http://localhost:8545")
        accounts = await web3.eth.getAccounts()
    })

    it("should deploy da contract", async function () {
        time = 2000000000
        await hre.network.provider.request({
            method:"evm_setNextBlockTimestamp",
            params: [time]
        })
        contract = await deployContract(ballotJSON, accounts[0], web3, [time + 10, time + 100,
            [
                strToBytes32('candidatA', web3),
                strToBytes32('candidatB', web3),
                strToBytes32('candidatC', web3)
            ]])
        await hre.network.provider.request({method:"evm_mine"})
    })

    it("should cast a vote", async function () {
        time += 20
        await hre.network.provider.request({
            method:"evm_setNextBlockTimestamp",
            params: [time]
        })
        await sendContrFunc(contract.methods.vote(strToBytes32('candidatA', web3),0),accounts[0])
        let scoreA = await contract.methods.getCandidateScore(strToBytes32('candidatA', web3)).call()
        assert(scoreA == 55 * (10 ** 18) /100) // keep non strict comparison
    })

    it("should cast some other votes", async function () {
        await sendContrFunc(contract.methods.vote(strToBytes32('candidatB', web3),1),accounts[0])
        await sendContrFunc(contract.methods.vote(strToBytes32('candidatC', web3),2),accounts[0])
        await sendContrFunc(contract.methods.vote(strToBytes32('candidatA', web3),1),accounts[0])
        // 4 votes in total
        let scoreA = await contract.methods.getCandidateScore(strToBytes32('candidatA', web3)).call()
        let scoreB = await contract.methods.getCandidateScore(strToBytes32('candidatB', web3)).call()
        let scoreC = await contract.methods.getCandidateScore(strToBytes32('candidatC', web3)).call()
        assert.equal(parseInt(scoreB), ((35 / 2) * (10 ** 18) / 100))
        assert.equal(parseInt(scoreA),(55 * (10 ** 18) / 100) + ((35 / 2) * (10 ** 18) /100))
        assert.equal(parseInt(scoreC), (10 * (10 ** 18) /100))
    })
})

const delay = ms => new Promise(res => setTimeout(res, ms));
