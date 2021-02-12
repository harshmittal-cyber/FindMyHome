const passport = require("passport");
const JWtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const Owner = require("../models/owner");
let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretorkey: "findmyhome",
};

passport.use(
  new JWtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload._id, function (err, user) {
      if (err) {
        console.log(jwt_payload, "findmyhome");
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        Owner.findById(jwt_payload._id, function (err, user) {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    });
  })
);

module.exports = passport;
