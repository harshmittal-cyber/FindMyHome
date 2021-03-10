const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const Owner = require("../models/owner");
const bcrypt = require("bcrypt");
const passportOneSessionPerUser = require("passport-one-session-per-user");

//local strategy for tenants
passport.use(
  "user",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("error", err);
          return done(err);
        }
        if (!user) {
          req.flash("error", "Invalid username or password");
          return done(null, false);
        }

        //compare password
        bcrypt.compare(password, user.password, function (err, result) {
          if (!result) {
            req.flash("error", "Invalid username or password");
            return done(null, false);
          }
        });
        return done(null, user);
      });
    }
  )
);

//local strategy for landowners
passport.use(
  "owner",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      Owner.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("error", err);
          return done(err);
        }
        if (!user) {
          req.flash("error", "Invalid username or password");
          return done(null, false);
        }
        //compare password
        bcrypt.compare(password, user.password, function (err, result) {
          if (!result) {
            req.flash("error", "Invalid username or password");
            return done(null, false);
          }
        });
        return done(null, user);
      });
    }
  )
);

passport.use(new passportOneSessionPerUser());
// // //serialize a user means user is stored as cookie in browser
passport.serializeUser(function (user, done) {
  console.log(user.id);
  done(null, user.id);
});

//deserialize a user means it check in database whether the cookie is matched with id or not
passport.deserializeUser(function (id, done) {
  //now object is stored in req and can be acesses throught owner and users routes
  User.findById(id, function (err, user) {
    if (user) {
      done(null, user);
    } else {
      Owner.findById(id, function (err, user) {
        if (user) {
          done(null, user);
        }
      });
    }
  });
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //if user is not signed in
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the signed in user information
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
