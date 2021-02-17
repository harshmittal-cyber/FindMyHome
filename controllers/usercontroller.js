const User = require("../models/user");
const Owner = require("../models/owner");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
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
function validatePassword(password) {
  const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$/;
  return re.test(password);
}

//Create a user
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
      req.flash("error", "Enter a strong password");
      return res.redirect("back");
    }
    //find the owner email if it register in database
    let owner = await Owner.findOne({ email: req.body.email });

    if (owner) {
      req.flash("error", "User already exist");
      return res.redirect("back");
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

    if (!owner) {
      //find the tenant email if it register in database
      let user = await User.findOne({ email: req.body.email });

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
        req.flash("error", "User already exist");
        return res.redirect("/users/signin");
      }
    }
  } catch (err) {
    console.log("Error in creating a user", err);
  }
};

module.exports.createSession = function (req, res) {
  console.log(req.user.id);
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};

module.exports.destroysession = function (req, res) {
  req.flash("success", "LogOut successfully");
  req.logout();
  return res.redirect("/");
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);

      User.uploadedimage(req, res, function (err) {
        if (err) {
          console.log("Multer error", err);
        }
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            console.log("done");
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }

          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      console.log("error", err);
      return res.redirect("back");
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
