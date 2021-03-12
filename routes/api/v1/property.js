const express = require("express");
const passport = require("passport");
const router = express.Router();
const property_controller = require("../../../api/v1/property_api");

router.get("/index", property_controller.index);
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  property_controller.createproperty
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  property_controller.destroy
);

module.exports = router;
