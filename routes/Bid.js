const express = require("express");
const router = express.Router();
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

router.get(
  "/destroy/:id",
  function (req, res, next) {
    if (req.isAuthenticated && req.user.isAdmin) {
      return res.redirect("back");
    } else if (req.isAuthenticated && !req.user.isAdmin) {
      return next();
    }
  },
  bid_controller.destroyBid
);
router.post(
  "/status",
  function (req, res, next) {
    if (req.isAuthenticated && req.user.isAdmin) {
      return next();
    } else if (req.isAuthenticated && !req.user.isAdmin) {
      return res.redirect("back");
    }
  },
  bid_controller.status
);

module.exports = router;
