const Owner = require("../models/owner");
const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports.profile = function (req, res) {
  return res.render("owner_profile", {
    title: "FindMyHome || Profile",
  });
};

module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
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

// REGX* FOR VALIDATING NEW ENTERED EMAIL
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports.create = function (req, res) {
  //FIND IF WE USER ALREADY EXIST AS A OWNER OR NOT
  const email = req.body.email;

  //checking if email is valid or not
  if (!validateEmail(email)) {
    req.flash("error", "Enter a valid email");
    return res.redirect("back");
  }
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
    if (req.body.phone < 6000000000) {
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
              req.flash("success", "User created successfully");
              return res.redirect("/owner/signin");
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
