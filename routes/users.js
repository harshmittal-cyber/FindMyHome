const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/usercontroller");

router.get("/profile", user_controller.user);
router.get("/signin", user_controller.signin);
router.get("/signup", user_controller.signup);
router.post("/create", user_controller.create);

module.exports = router;
