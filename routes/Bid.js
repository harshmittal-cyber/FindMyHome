const express = require("express");
const router = express.Router();
const property_controller = require("../controllers/property_controller");
const bid_controller = require("../controllers/Bidcontroller");

router.post(
  "/create",
  function (req, res, next) {
    if (req.isAuthenticated && req.user.isAdmin) {
      return res.redirect("back");
    } else if (req.isAuthenticated && !req.user.isAdmin) {
      return next();
    }
  },
  bid_controller.createBid
);

module.exports = router;
