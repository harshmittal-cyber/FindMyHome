const Owner = require("../models/owner");
const User = require("../models/user");
const bcrypt = require("bcrypt");
module.exports.owner = function (req, res) {
  return res.render("owner_profile", {
    title: "FindMyHome || Profile",
  });
};

module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/owner/profile");
  }
  return res.render("owner_signin", {
    title: "FindMyHome || OwnerSignin",
  });
};

module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/owner/profile");
  }
  return res.render("owner_signup", {
    title: "FindMyHome || OwnerSignUp",
  });
};

module.exports.create = function (req, res) {
  //CHECK IF USER CREATED AS A CUSTOMER OR NOT
  User.findOne({ email: req.body.email }, function (err, user, cb) {
    if (user) {
      console.log("Account already exist as a customer");
      return res.redirect("/");
    }
    //CHECK IF PASSWORD MATCH WITH CONFIRM PASSWORD OR NOT
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
    //CHECK IF MOBILE NO. IS OF 10 DIGITS OR NOT
    if (req.body.phone < 1000000000) {
      return res.redirect("back");
    }
    //CREATE THE OWNER
    Owner.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        console.log("Error in finding the user", err);
      }

      if (!user) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          Owner.create(
            {
              email: req.body.email,
              password: hash,
              name: req.body.name,
              phone: req.body.phone,
              place: req.body.place,
            },
            function (err, user) {
              if (err) {
                return res.status(500).send("Error in creating a user");
              }
              return res.send(user);
            }
          );
        });
      } else {
        return res.redirect("/owner/signin");
      }
    });
  });
};

module.exports.createSession = function (req, res) {
  return res.redirect("/owner/profile");
};

module.exports.destroysession = function (req, res) {
  req.logout();
  return res.redirect("/");
};
