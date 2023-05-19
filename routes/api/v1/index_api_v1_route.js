const express = require("express");

// import routes for login actions
const loginRouter = require("./api_v1_login_route");

const router = express.Router();

// direct all login requests to api_v1_login_route
router.use("/login-with-otp", loginRouter);

module.exports = router;