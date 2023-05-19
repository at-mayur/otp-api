
// Variables for app
const dev = {
    PORT: 8000,

    // Mongo DB URL
    MONGO_DB_URL: "mongodb://127.0.0.1:27017/otp_login",

    // Google mail account and app password for configuring mailer.
    GOOGLE_MAIL_USER: "", // Your mail account id will go here
    GOOGLE_MAIL_PASSWORD: "", // Your mail account app password will go here

    // Secret for jsonwebtoken.
    JWT_SECRET: "C26EADF6D16AAEAEC39EE165267D6"
};

module.exports = dev;