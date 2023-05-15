const nodemailer = require('nodemailer');
const sendMail = {};

sendMail.transporter = nodemailer.createTransport({
  name: process.env.MAIL_NAME,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID, // generated ethereal user
    pass: process.env.MAIL_PASS  // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
});

// let info = await this.transporter.sendMail({
//     from: '"Test" <robdres123@gmail.com>', // sender address
//     to: "robdres123@gmail.com",
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
// }
// )
// send mail with defined transport object
module.exports = sendMail;
