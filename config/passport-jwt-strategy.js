const passport = require("passport");
const JWtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const Owner = require("../models/owner");
const env = require("./env");

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secretOrKey,
};

passport.use(
  new JWtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload._id, function (err, user) {
      if (err) {
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
