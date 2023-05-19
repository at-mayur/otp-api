const mongoose = require("mongoose");

// used OTP schema to store previously used otp.
const usedOtpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
}, { timestamps: true });


const usedOtp = mongoose.model("Used_OTP", usedOtpSchema);

module.exports = usedOtp;