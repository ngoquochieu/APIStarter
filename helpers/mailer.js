const nodemailer = require('nodemailer');

exports.sendMail = (to, subject, htmlContent) => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: process.env.MAIL_HOST, 
        port: process.env.MAIL_PORT,
        // secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD// naturally, replace both with your real credentials or an application-specific password
        }
      });
        const mailOptions = {
        from: process.env.MAIL_PROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent
      };
      return transporter.sendMail(mailOptions);
}
    