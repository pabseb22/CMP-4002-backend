const mysqlConnection = require('../api/connection/connection');
const { transporter } = require('../helpers/email');
const handlebars = require('handlebars')
let fs = require('fs');
const mailing = {};

let sender_email = process.env.MAIL_ID;

//Helpers handlebars
handlebars.registerHelper('toFixed', function (number) {
  return number.toFixed(0);
})

mailing.testMail = async () => {
  const path = './public/email_templates/email_negotiation.html';
  let htmlF = fs.readFileSync(path).toString();
  if (!htmlF) {
    return 0
  } else {

    let replacements = { }

    let recipients = []
    mysqlConnection.query("SELECT email FROM `auction-app`.users ",
      (err, rows) => {
        if (!err) {
          if (rows.length > 0) {
            let recipient = []
            recipients = Object.values(JSON.parse(JSON.stringify(rows)))
            for (i in recipients) {
              recipient.push(recipients[i].email)
            }

            let template = handlebars.compile(htmlF)
            let htmlToSent = template(replacements)
            let mailOptions = {
              from: `"Auction Services" <${sender_email}>`, // sender address
              to: recipient, 
              subject: 'Auction Ended', // Subject line
              text: 'Auctions Notifications', // plain text body
              html: htmlToSent,
            };
            sendMail(mailOptions);
          } else {
            res.json('error');
          }
        } else {
          console.log(err);
        }
      })

  }
}


function file(path) {
  try {
    const data = fs.readFileSync(path, "utf8");
    return data;
  } catch (err) {
    return 0;
  }
}

async function sendMail(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    return 1;
  } catch (error) {
    console.log(error);
    console.log("error al enviar\n\n");
    return 0;
  }
}



module.exports = mailing;
