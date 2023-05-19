const express = require("express");

// import routes for api actions
const apiRouter = require("./api/index_api_route");

const router = express.Router();

// direct all api requests to index_api_route
router.use("/api", apiRouter);

module.exports = router;