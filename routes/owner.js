const express = require("express");
const router = express.Router();
const owner_controller = require("../controllers/ownercontroller");
const passport = require("passport");
const user_controller = require("../controllers/usercontroller");

router.get(
  "/profile",
  function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    } else {
      return res.redirect("back");
    }
  },
  owner_controller.profile
);

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

router.get("/destroysession", user_controller.destroysession);

module.exports = router;
