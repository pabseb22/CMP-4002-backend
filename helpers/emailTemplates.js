const mysqlConnection = require('../api/connection/connection');
const { transporter } = require('../helpers/email');
const handlebars = require('handlebars')
let fs = require('fs');
const mailing = {};

let sender_email = "pablosebas2002@hotmail.com";

//Helpers handlebars
handlebars.registerHelper('toFixed', function (number) {
  return number.toFixed(0);
})

mailing.testMail = async (message, email, name, phone) => {
  const path = './public/email_templates/email_negotiation.html';
  let htmlF = fs.readFileSync(path).toString();
  if (!htmlF) {
    return 0
  } else {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0! var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let usersEmails;

    let replacements = {
      numero: "200",
      vendedor: "Vendedor",
      fecha: today,
      cliente: "Cliente",
    }
    let template = handlebars.compile(htmlF)
    let htmlToSent = template(replacements)


    let mailOptions = {
      from: `"Outdoors media" <${sender_email}>`, // sender address
      to: "pablosebas2002@hotmail.com", // list of receivers should be splitted by commas if any
      subject: 'Email de prueba', // Subject line
      text: 'Notificaciones Outdoors', // plain text body
      html: 'Hola',
    };

    let answer = await sendMail(mailOptions);
    return answer;
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
    mailOptions.to += ", it@outdoorsmediaec.net"
    await transporter.sendMail(mailOptions);
    console.log("Sent Email to: ", mailOptions.to);
    return 1;
  } catch (error) {
    console.log(error);
    console.log("error al enviar\n\n");
    return 0;
  }
}



module.exports = mailing;
