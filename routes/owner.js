const express = require("express");
const router = express.Router();
const owner_controller = require("../controllers/ownercontroller");
const passport = require("passport");

router.get("/profile", passport.checkAuthentication, owner_controller.owner);
router.get("/signin", owner_controller.signin);
router.get("/signup", owner_controller.signup);

router.post("/create", owner_controller.create);
router.post(
  "/create-session",
  passport.authenticate("owner", {
    failureRedirect: "/owner/signin",
  }),
  owner_controller.createSession
);

router.get("/destroysession", owner_controller.destroysession);

module.exports = router;
