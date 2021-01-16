const nodemailer = require('nodemailer');

async function startMail(){
  let transporter = await new Promise((resolve, reject) => {
    var smtpSettings = {
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'gowthamtest55@gmail.com',
        pass:  '12345@Dd'
      }
    };
    var transporter = nodemailer.createTransport(smtpSettings);
    global.transporter = transporter;
    resolve(transporter);
  });
  global.transporter = transporter;
}

//global.transporter = startMail();
startMail();

async function sendMail(toMails, subject, text){
  let mailOptions = {
      from: '"Admin " <ngowthamtest55@gmail.com>', // sender address
      to: toMails, // list of receivers
      subject: subject, // Subject line
      //text: text, // plain text body
      html: text // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account

  });
}

module.exports = {sendMail: sendMail};
