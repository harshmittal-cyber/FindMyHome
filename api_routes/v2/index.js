const express = require("express");
const router = express.Router();

router.use("/users", require("./userapi"));
router.use("/owner", require("./userapi"));

module.exports = router;
