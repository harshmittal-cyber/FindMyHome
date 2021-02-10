const express = require("express");
const router = express.Router();
const user_controller_api = require("../../../controllers/api/v1/user_api");

router.post("/createsession", user_controller_api.createSession);

module.exports = router;
