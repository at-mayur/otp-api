const nodemailer = require("nodemailer");

const ejs = require("ejs");

const path = require("path");

const devConstants = require("../env");

// Creating a transport for sending mails
const transport = nodemailer.createTransport({
    // Using gmail service & smtp server
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    // authentication for mail account
    auth: {
        user: devConstants.GOOGLE_MAIL_USER,
        pass: devConstants.GOOGLE_MAIL_PASSWORD
    }
});



// function to get mail template on providing data
const getTemplate = (data) => {

    let template = "";

    const filePath = path.join(__dirname, "../views/mailTemplates/otpMailTemplate.ejs");

    // render template file with ejs and provided data
    ejs.renderFile(filePath, {data}, (error, temp) => {

        if(error){
            console.error(error);
            return;
        }

        template = temp;
        
    });

    // return template
    return template;

};


module.exports = {
    transport,
    getTemplate
};