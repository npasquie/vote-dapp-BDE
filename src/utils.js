async function sendContrFunc(stuffToDo, from, value){
    let gas = await stuffToDo.estimateGas({from: from, value: value})
    return await stuffToDo.send({from: from, gas: gas, value: value, gasPrice: (15000000000).toString()}) // 15 Gwei gas price
}

async function deployContract(json, from, web3, args){
    let contract = await new web3.eth.Contract(json.abi)
    return await sendContrFunc(contract.deploy({data:json.bytecode, arguments: args}), from)
}

function strToBytes32 (str, web3) {
    let ret
    ret = web3.utils.utf8ToHex(str)
    ret = web3.utils.hexToBytes(ret)
    ret = ret.concat(new Array(32 - ret.length).fill(0))
    ret = web3.utils.bytesToHex(ret)
    return ret.slice(0, 32)
}

module.exports = {sendContrFunc, deployContract, strToBytes32}
