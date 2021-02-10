const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/owner", require("./owner"));
module.exports = router;
