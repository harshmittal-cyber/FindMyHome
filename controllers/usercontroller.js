const User = require("../models/user");
const Owner = require("../models/owner");
const bcrypt = require("bcrypt");

module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "FindMyHome || Profile",
  });
};

//rendering signin page
module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("user_signin", {
    title: "FindMyHome || UserSignIn",
  });
};

//renderring signup page
module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_signup", {
    title: "FindMyHome || UserSignUp",
  });
};

// REGX* FOR VALIDATING NEW ENTERED EMAIL
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// //IF TRUE
// function validatePassword(password) {
//   const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
//   return re.test(password);
// }

//Create a user
module.exports.create = function (req, res) {
  //FIND IF WE USER ALREADY EXIST AS A OWNER OR NOT
  const email = req.body.email;

  //checking if email is valid or not
  if (!validateEmail(email)) {
    req.flash("error", "Enter a valid email");
    return res.redirect("back");
  }

  // if (!validatePassword(password)) {
  //   req.flash("error", "Enter a valid password");
  // }

  Owner.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      req.flash("error", err);
      console.log("Error in finding a user", err);
      return res.status(500).send("error occured");
    }
    if (user) {
      req.flash("error", "User already exist");
      return res.status(500).send("Username already exist");
    }

    //CHECK IF PASSWORD MATCH WITH CONFIRM PASSWORD OR NOT
    if (req.body.password != req.body.confirm_password) {
      req.flash("Password not matched");
      return res.redirect("back");
    }
    //CHECK IF MOBILE NO. IS OF 10 DIGITS OR NOT
    if (req.body.phone < 6000000000) {
      req.flash("error", "Enter valid mobile number");
      return res.redirect("back");
    }
    //CREATE A USER
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        req.flash("error", err);
        console.log("Error in finding a user", err);
        return res.status(500).send("error occured");
      }

      if (!user) {
        //encrypt the password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          User.create(
            {
              email: req.body.email,
              password: hash,
              name: req.body.name,
              phone: req.body.phone,
            },
            function (err, user) {
              if (err) {
                req.flash("error", err);
                return res.status(500).send("Error in creating a user");
              }
              req.flash("success", "User created successfully");
              return res.redirect("/users/signin");
            }
          );
        });
      } else {
        return res.redirect("back");
      }
    });
  });
};

module.exports.createSession = function (req, res) {
  console.log(req.user.id);
  req.flash("success", "Logged in successfully");
  return res.redirect("/users/profile");
};

module.exports.destroysession = function (req, res) {
  req.flash("success", "LogOut successfully");
  req.logout();
  return res.redirect("/");
};
