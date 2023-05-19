const queue = require("../config/kue");

// import controller to send mail.
const mailControllers = require("../controllers/mailController");

queue.process("otpMailSender", (job, done) => {

    // for every job in queue send mail with provided data.
    mailControllers.otpMailController(job.data);

    done();

});

module.exports = queue;