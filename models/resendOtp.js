const mongoose = require("mongoose");

// resend OTP schema to store recently sent otp.
const resendOtpSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        // it will remove entire document after mentioned seconds.
        expires: 60
    }
}, { timestamps: true });


const resendOtp = mongoose.model("Resend_OTP", resendOtpSchema);

module.exports = resendOtp;