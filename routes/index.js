const express = require("express");
const router = express.Router();
const home_controller = require("../controllers/homecontroller");
const passport = require("passport");
const owner_controller = require("../controllers/ownercontroller");

router.get("/", home_controller.home);
router.use("/api", require("./api"));
router.use("/users/", require("./users"));
router.use("/owner/", require("./owner"));
router.use("/property", require("./property"));
module.exports = router;
