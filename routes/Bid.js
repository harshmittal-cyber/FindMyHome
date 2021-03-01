const express = require("express");
const router = express.Router();
const property_controller = require("../controllers/property_controller");
const comment_controller = require("../controllers/Bidcontroller");
const { localsName } = require("ejs");

router.post(
  "/create",
  function (req, res, next) {
    if (req.isAuthenticated && req.user.isAdmin) {
      return res.redirect("back");
    } else if (req.isAuthenticated && !req.user.isAdmin) {
      return next();
    }
  },
  comment_controller.createBid
);

module.exports = router;
