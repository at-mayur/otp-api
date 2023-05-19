const express = require("express");

// import routes for api v1 actions
const v1Router = require("./v1/index_api_v1_route");

const router = express.Router();

// direct all api v1 requests to index_api_v1_route
router.use("/v1", v1Router);

module.exports = router;