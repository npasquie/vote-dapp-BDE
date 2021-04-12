const Web3 = require("web3")
const chainInfo = require("./chain_info.json")
const ballotJsonInterface = require("./build/BallotBDE.json")
const mainAddress = require("./address.json")
const ballotArgs = require("./ballot_args.json")
const bA = require("./ballot-utils")

async function deployBallot(chain) {
    console.log(chain)
    let web3 = await new Web3(chainInfo[chain])
    let accounts = await web3.eth.getAccounts()
    const ballotBDE = await new web3.eth.Contract(ballotJsonInterface.abi)
    await web3.eth.accounts.privateKeyToAccount(mainAddress.private_key)
    const startDate = await new Date(ballotArgs.startDate)
    const endDate = await new Date(ballotArgs.endDate)
    await ballotBDE.deploy({
        data:ballotJsonInterface.bytecode,
        arguments: [1718240099,1718245099,true,['0x41746c61730000000000000000000000']]
    }).send({from: accounts[0]})
        .on('receipt', receipt => {
            console.log("deployed at : " + receipt.contractAddress)})
}

deployBallot(process.argv[2])
