const mongoose = require("mongoose");

// Active OTP schema to store active otp for user.
const activeOtpSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        // it will remove entire document after mentioned seconds.
        expires: 5*60
    }
}, { timestamps: true });


const activeOtp = mongoose.model("Active_OTP", activeOtpSchema);

module.exports = activeOtp;