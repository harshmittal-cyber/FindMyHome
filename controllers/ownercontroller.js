const Owner = require("../models/owner");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

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

// //IF TRUE
function validatePassword(password) {
  const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
  return re.test(password);
}

module.exports.create = async function (req, res) {
  //FIND IF WE USER ALREADY EXIST AS A OWNER OR NOT
  try {
    const email = req.body.email;
    const password = req.body.password;

    //checking if email is valid or not
    if (!validateEmail(email)) {
      req.flash("error", "Enter a valid email");
      return res.redirect("back");
    }

    if (!validatePassword(password)) {
      req.flash("error", "Enter a Strong password");
      return res.redirect("back");
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      req.flash("error", "User already exist as a Buyer");
      return res.redirect("back");
    }

    //CHECK IF PASSWORD MATCH WITH CONFIRM PASSWORD OR NOT
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
    //CHECK IF MOBILE NO. IS OF 10 DIGITS OR NOT
    if (req.body.phone < 6000000000) {
      return res.redirect("back");
    }

    if (!user) {
      let owner = await Owner.findOne({ email: req.body.email });

      if (!owner) {
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
        req.flash("error", "User already exist");
        return res.redirect("/owner/signin");
      }
    }
  } catch (err) {
    console.log("error in creating a user", err);
    return res.redirect("back");
  }
};

module.exports.createSession = function (req, res) {
  return res.redirect("/");
};

module.exports.update = function (req, res) {
  if (req.user.id == req.params.id) {
    Owner.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
      return res.redirect("back");
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
