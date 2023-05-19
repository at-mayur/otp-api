const express = require("express");

// variables
const devConstants = require("./env");

// db connection
const mongoConnection = require("./config/mongoDbConnection");

// Routes for app.
const routes = require("./routes/index_route");


// initiate app
const app = express();


// initiate middleware to extract x-www-form-urlencoded data in req.body
app.use(express.urlencoded());

// initiate middleware to extract raw json data in req.body
app.use(express.json());

// initialize routes
app.use("/", routes);


// Make app to listen at provided port
app.listen(devConstants.PORT, (error) => {
    if(error){
        console.error(error);
        return;
    }

    console.log("Listening on port", devConstants.PORT);
});