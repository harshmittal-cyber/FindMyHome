const User = require("../models/user");
const Owner = require("../models/owner");
const bcrypt = require("bcrypt");

module.exports.user = function (req, res) {
  return res.render("user_profile", {
    title: "FindMyHome || Profile",
  });
};

//rendering signin page
module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
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

//Create a user
module.exports.create = function (req, res) {
  //FIND IF WE USER ALREADY EXIST AS A OWNER OR NOT
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
              return res.send(user);
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
  req.flash("success", "Logged in successfully");
  return res.redirect("/users/profile");
};

module.exports.destroysession = function (req, res) {
  req.flash("success", "LogOut successfully");
  req.logout();
  return res.redirect("/");
};
