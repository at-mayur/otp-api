const mailTransport = require("../config/nodeMailer");

const devConstants = require("../env");

module.exports.otpMailController = (otpData) => {

    // get mail template
    const mailTemplate = mailTransport.getTemplate(otpData);

    // send mail with above mail template
    mailTransport.transport.sendMail({

        to: otpData.user_email,
        from: devConstants.GOOGLE_MAIL_USER,
        subject: "Login to your account",
        html: mailTemplate

    }, (error, info) => {

        if(error){
            console.error(error);
            return;
        }

        // console.log(info);

    });

};