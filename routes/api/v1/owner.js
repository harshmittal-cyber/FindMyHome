const express = require("express");
const router = express.Router();
const owner_controller_api = require("../../../controllers/api/v1/owner_api");

router.post("/createsession", owner_controller_api.createSession);

module.exports = router;
