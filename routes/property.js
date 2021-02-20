const express = require("express");
const router = express.Router();
const property_controller = require("../controllers/property_controller");

router.post(
  "/create",
  function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    } else {
      return res.redirect("back");
    }
  },
  property_controller.createproperty
);

module.exports = router;

router.get(
  "/destroy/:id",
  function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    } else {
      return res.redirect("back");
    }
  },
  property_controller.destroy
);
