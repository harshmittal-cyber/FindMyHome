const express = require("express");
const router = express.Router();
const property_controller = require("../controllers/property_controller");
const comment_controller = require("../controllers/Bidcontroller");

router.post("/create", comment_controller.createBid);

module.exports = router;
