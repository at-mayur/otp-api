const mongoose = require("mongoose");

// Blocked Account schema to store blocked accounts.
const blockedAccountSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        // it will remove entire document after mentioned seconds.
        expires: 60*60
    }
}, { timestamps: true });


const blockedAccount = mongoose.model("Blocked_Account", blockedAccountSchema);

module.exports = blockedAccount;