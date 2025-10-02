const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host: process.env.MAIL_HOST,
port: process.env.MAIL_PORT,
secure: false, // true for 465, false for other ports
auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
},
});

async function sendMail(to, subject, html) {
return transporter.sendMail({
    from: "Know Before You Go",
    to,
    subject,
    html,
});
}

module.exports = sendMail;
