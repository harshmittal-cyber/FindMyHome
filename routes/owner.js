const express = require("express");
const router = express.Router();
const owner_controller = require("../controllers/ownercontroller");

router.get("/profile", owner_controller.owner);
router.get("/signin", owner_controller.signin);
router.get("/signup", owner_controller.signup);

router.post("/create", owner_controller.create);

module.exports = router;
