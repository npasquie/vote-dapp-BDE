const Web3 = require("web3")
const chainInfo = require("./chain_info.json")
const ballotJsonInterface = require("./build/BallotBDE.json")
const mainAddress = require("./address.json")
const ballotArgs = require("./ballot_args.json")
const misc = require("./ballot-utils")

async function deployBallot(chain) {
    const web3 = await new Web3(chainInfo[chain])
    const ballotBDE = await new web3.eth.Contract(ballotJsonInterface.abi)
    await web3.eth.accounts.privateKeyToAccount(mainAddress.private_key)
    const endDate = await new Date(ballotArgs.endDate)
    await ballotBDE.deploy({
        data:ballotJsonInterface.bytecode,
        arguments: ballotArgsHandler(ballotArgs.name,ballotArgs.question,endDate,true,ballotArgs.candidateNames)
    }).send({from: mainAddress.address})
        .on('receipt', receipt => {
            console.log("deployed at : " + receipt.contractAddress)})
}

deployBallot(process.argv0)
