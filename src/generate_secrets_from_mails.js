const fs = require("fs")

try {
    const data = fs.readFileSync('./mailsEtPonderation.csv', 'utf8')
    generateSecrets(data)
} catch (err) {
    console.error(err)
}

function generateSecrets(data){
    const LEADING = 0, MEMBER = 1, LEAVING = 2 // enum-like in js
    let mail, weighting, tempUserStruct, tempCode, tempWeightCode
    let allUsersData = []
    const rows = data.split('\n')
    rows.forEach(row => {
        [mail, weighting] = row.split(';')
        switch (weighting){
            case '35%\r':
                tempWeightCode = MEMBER
                break
            case '55%\r':
                tempWeightCode = LEADING
                break
            case '10%\r':
                tempWeightCode = LEAVING
                break
            default:
                tempWeightCode = MEMBER
        }
        tempCode = Math.random().toString(36).substring(2);
        tempUserStruct = {mail: mail, code: tempCode, weightCode: tempWeightCode}
        if(mail !== '') // prevent last empty line to generate a possible vote
            allUsersData.push(tempUserStruct)
    })
    fs.writeFile("users_mails_and_codes.json",JSON.stringify(allUsersData,null,' '),'utf8',()=>{
        console.log('done')})
}
