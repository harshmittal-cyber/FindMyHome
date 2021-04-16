const express = require("express");
const router = express.Router();
const user_controller_api = require("../../api/v2/userapi");

router.post("/signup", user_controller_api.create);
router.post("/login", user_controller_api.createSession);

module.exports = router;
