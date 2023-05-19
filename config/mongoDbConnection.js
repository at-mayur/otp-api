const mongoose = require("mongoose");

const devConstants = require("../env");

// Connecting to db
mongoose.connect(devConstants.MONGO_DB_URL)
.then(() => {
    console.log("Connected to DB...");
})

// Handling error while connection
.catch((error) => {
    console.error(error);
});


module.exports = mongoose.connection;
