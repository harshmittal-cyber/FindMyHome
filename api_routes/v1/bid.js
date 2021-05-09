const express = require("express");
const router = express.Router();
const bid_controller = require("../../api/v1/Bid_api");
const passport = require("passport");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  bid_controller.createBid
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  bid_controller.destroyBid
);

router.post("/status", bid_controller.status);

module.exports = router;
