require("node-mailjet").connect(
  process.env.API_MAILJET_KEY,
  process.env.API_MAILJET_SECRET
);
const mailer = require("nodemailer");
const smtp = require("nodemailer-smtp-transport");


module.exports=async function mailjetFN(mailPayload) {
    const { receivers, subject, text } = mailPayload;
    const transport = mailer.createTransport(
      smtp({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
          user: process.env.API_MAILJET_KEY ,
          pass: process.env.API_MAILJET_SECRET ,
        },
      })
    );
  
    const json = await transport.sendMail({
      from: process.env.MAILER_ADDRESS,
      to: receivers,
      subject: subject, // Subject
      html: text, // Contents
    });
    return json;
  }
  