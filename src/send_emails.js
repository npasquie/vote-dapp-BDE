const nodemailer = require("nodemailer");
const mailConfig = require("./mailConfig.json")

const delay = ms => new Promise(res => setTimeout(res, ms));

async function sendMails(subject, candidateNames, userInfos, prodMode){
    let mailOptions = {
        from: mailConfig.from,
        to: mailConfig.first_email,
        subject: 'vote-dapp-GarageISEP : votez ! ' + subject,
        text: 'envoi reussi ?'
    }
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

    let noSuccessYet = true

    if(prodMode){
        while (noSuccessYet) {
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    console.log("will retry to send a mail shortly ...")
                } else {
                    noSuccessYet = false
                    console.log('Email sent: ' + info.response); // ca marche :)
                }
            })
            await delay(1500)
        }
    }

    for (const user of userInfos) {
        text =
            `GarageISEP vous invite à participer au vote : ${subject}\npour voter, cliquez sur le lien de votre choix, attention, aucune confirmation ne vous sera demandée et le vote est définitif.\nces liens contiennent votre code votant confidentiel, ne les partagez à personne.\n`
        candidateNames.forEach(name => {
            text += name + ` : https://vote.garageisep.com/vote/${encodeURIComponent(name)}/${user.code}\n`
        })
        mailOptions = {
            from: mailConfig.from,
            to: user.mail,
            subject: 'vote-dapp-GarageISEP : votez ! ' + subject,
            text: text
        }

        if(prodMode){
            await delay(1500)
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
