const fs = require("fs")

try {
    const data = fs.readFileSync('./AnnuaireISEP2021_2025.csv', 'utf8')
    generateSecrets(data)
} catch (err) {
    console.error(err)
}

function generateSecrets(data){
    let tempCode
    let tempUserStruct
    const mails = data.split(';\r\n')
    let allUsersData = []
    mails.forEach(mail => {
        tempCode = Math.random().toString(36).substring(2);
        tempUserStruct = {mail: mail, code: tempCode}
        allUsersData.push(tempUserStruct)
    })
    fs.writeFile("users_mails_and_codes",JSON.stringify(allUsersData),'utf8',()=>{
        console.log('done')})
}
