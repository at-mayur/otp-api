const express = require("express");

const router = express.Router();

// import controller
const loginController = require("../../../controllers/loginController");

// route to create otp
router.post("/create-otp", loginController.otpController);

// route to login and create jwt
router.post("/login", loginController.loginActionController);

module.exports = router;