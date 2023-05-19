const mongoose = require("mongoose");

// wrong attempt schema to store wrong login attempts made by user.
const wrongAttemptSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        required: true
    }
}, { timestamps: true });


const wrongAttempt = mongoose.model("Wrong_Attempt", wrongAttemptSchema);

module.exports = wrongAttempt;