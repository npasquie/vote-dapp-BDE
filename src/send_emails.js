const nodemailer = require("nodemailer");
const mailConfig = require("./mailConfig.json")

async function sendMails(subject, candidateNames, userInfos, prodMode){
    let mailOptions
    let text
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: mailConfig.user,
            pass: mailConfig.pass,
        }
    })

    for (const user of userInfos) {
        text = `GarageISEP vous invite à participer au vote : ${subject}\n 
                pour voter, cliquez sur le lien de votre choix, attention, aucune confirmation ne vous sera demandée et le vote est définitif.\n
                ces liens contiennent votre code votant confidentiel, ne les partagez à personne.\n`
        candidateNames.forEach(name => {
            text += name + ` : https://vote.garageisep.com/vote/${name}/${user.code}$\n`
        })
        mailOptions = {
            from: mailConfig.from,
            to: user.mail,
            subject: mailConfig.subject,
            text: text
        }

        if(prodMode){
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response); // ca marche :)
                }
            })
        }
    }
    console.log("number of mails : " + userInfos.length)
}

module.exports = {sendMails}
