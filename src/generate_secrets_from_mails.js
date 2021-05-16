function generateSecrets(data){
    const LEADING = 0, MEMBER = 1, LEAVING = 2 // enum-like in js
    let mail, weighting, tempUserStruct, tempCode, tempWeightCode
    let nbsOfVoters = [0,0,0]
    let allUsersData = []
    const rows = data.split('\n')
    rows.forEach(row => {
        [mail, weighting] = row.split(';')
        switch (weighting){
            case '35%\r':
                tempWeightCode = MEMBER
                nbsOfVoters[MEMBER]++
                break
            case '55%\r':
                tempWeightCode = LEADING
                nbsOfVoters[LEADING]++
                break
            case '10%\r':
                tempWeightCode = LEAVING
                nbsOfVoters[LEAVING]++
                break
            default:
                tempWeightCode = MEMBER
                nbsOfVoters[MEMBER]++
        }
        tempCode = Math.random().toString(36).substring(2);
        tempUserStruct = {mail: mail, code: tempCode, weightCode: tempWeightCode}
        if(mail !== '') // prevent last empty line to generate a possible vote
            allUsersData.push(tempUserStruct)
    })
        console.log('secrets file generated')
    return {nbsOfVoters: nbsOfVoters, allUsersData:allUsersData}
}

module.exports = {generateSecrets}
