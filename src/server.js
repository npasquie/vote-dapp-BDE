const express = require('express')
const app = express()
const port = 3000
const Web3 = require("web3")
const utils = require("../src/utils")
const chainInfo = require("chain_info.json")
const ballotJSON = require("../artifacts/contracts/BallotGarageISEP.sol/BallotGarageISEP.json")
const generator = require("generate_secrets_from_mails")
const fs = require("fs")
const data = fs.readFileSync('./mailsEtPonderation.csv', 'utf8')
generator.generateSecrets(data)

let web3 = new Web3(chainInfo.localhost)
let accounts = web3.eth.getAccounts()
let nowTimestamp = Math.floor(Date.now() / 1000)
let candidateNames = []
let voteDuration
process.argv.forEach((val, index) => {
    if(index > 1){
        if(index === 2) {
            voteDuration = parseInt(val)
        } else {
            candidateNames.push(val)
        }
    }
})
let candidatesArg = []
candidateNames.forEach(name => candidatesArg.push(utils.strToBytes32(name)))
let ballot = await utils.deployContract(ballotJSON,accounts[0],web3,nowTimestamp, nowTimestamp + voteDuration, candidatesArg)
let userInfos = JSON.parse(fs.readFileSync("../users_mails_and_codes.json", 'utf8'))
let codesThatVoted = []

app.get('/results', async (req, res) => {
    let scores = []
    let tempScore
    for (const name of candidateNames) {
        tempScore = await ballot.methods.getCandidateScore(utils.strToBytes32(name)).call()
        tempScore = tempScore / (10 ** 18)
        scores.push({name: name, score: tempScore})
    }
    let returnedString = "scores actuels : \n"
    scores.forEach(score => returnedString += score.name + " : " + score.score + "\n")
    if (Math.floor(Date.now() / 1000) < nowTimestamp + voteDuration) {
        returnedString += "attention : les votes ne sont pas encore clos"
    } else {
        returnedString += "ces scores sont les résultats finaux."
    }
    res.send(returnedString)
})

app.get('/vote/:vote/:secret', async (req, res) => {
    let vote = req.params.vote, secret = req.params.secret
    let user = userInfos.find(user => user.code === secret)
    let receipt

    if (user === undefined){
        res.send('error : no user with this code found')
        return
    }
    if (codesThatVoted.some(code => code === user.code)){
        res.send('vous avez déjà voté, vous ne pouvez pas voter à nouveau.')
        return
    }

    try {
        receipt = await utils.sendContrFunc(ballot.methods.vote(utils.strToBytes32(vote),parseInt(user.weightCode)))
        res.send('Vote envoyé à la blockchain. hash de la transaction : ' + receipt.transactionHash)
    } catch (err) {
        res.send('error : ' + err)
    }
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
