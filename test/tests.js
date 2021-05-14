const Web3 = require("web3")
const hre = require("hardhat")
const assert = require('assert')

const ballotJSON = require("../artifacts/contracts/BallotGarageISEP.sol/BallotGarageISEP.json")

describe("garageisep ballot test suite", function (){
    let web3
    let accounts

    this.timeout(20000)

    before(async function (){
        hre.run("node")
        await delay(3500)
        web3 = new Web3("http://localhost:8545")
        accounts = await web3.eth.getAccounts()
    })

    it("should deploy da contract", async function () {
        let now = Math.floor(Date.now()/1000)
        console.log([now + 3, now + 100,
            web3.eth.abi.encodeParameter('bytes32[]',[
                web3.utils.toHex('candidatA'),
                web3.utils.toHex('candidatB'),
                web3.utils.toHex('candidatC')
            ])
        ])
        let deployedAt = await deployContract(ballotJSON, accounts[0], web3, [now + 3, now + 100,
            web3.eth.abi.encodeParameter('bytes32[]',[
                web3.utils.toHex('candidatA'),
                web3.utils.toHex('candidatB'),
                web3.utils.toHex('candidatC')
            ])
        ])
        console.log(deployedAt)
    })
})

async function sendContrFunc(stuffToDo, from, value){
    let gas = await stuffToDo.estimateGas({from: from, value: value})
    return await stuffToDo.send({from: from, gas: gas + 21000, gasPrice: '30000000', value: value})
}

async function deployContract(json, from, web3, args){
    let contract = await new web3.eth.Contract(json.abi)
    return await sendContrFunc(contract.deploy({data:json.bytecode, arguments: args}), from)
}

const delay = ms => new Promise(res => setTimeout(res, ms));
