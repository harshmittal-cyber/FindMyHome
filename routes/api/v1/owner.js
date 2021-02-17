const express = require("express");
const router = express.Router();
const owner_controller_api = require("../../../api/v1/owner_api");

router.post("/login", owner_controller_api.createSession);
router.post("/signup", owner_controller_api.create);
module.exports = router;
