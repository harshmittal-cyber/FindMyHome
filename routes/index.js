const express = require("express");
const router = express.Router();
const home_controller = require("../controllers/homecontroller");

router.get("/", home_controller.home);
router.use("/api", require("./api"));
router.use("/users/", require("./users"));
router.use("/owner/", require("./owner"));
router.use("/property", require("./property"));
router.use("/bid", require("./Bid"));

module.exports = router;
