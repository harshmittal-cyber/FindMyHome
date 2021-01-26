const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/usercontroller");
const passport = require("passport");
router.get("/profile", passport.checkAuthentication, user_controller.user);
router.get("/signin", user_controller.signin);
router.get("/signup", user_controller.signup);

router.post("/create", user_controller.create);
router.post(
  "/createSession",
  passport.authenticate("user", {
    failureRedirect: "/users/signin",
  }),
  user_controller.createSession
);

router.get("/destroysession", user_controller.destroysession);

module.exports = router;
