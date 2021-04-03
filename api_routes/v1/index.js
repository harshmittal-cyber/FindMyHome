const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/owner", require("./owner"));
router.use("/property", require("./property"));
router.use("/bid", require("./bid"));

module.exports = router;
