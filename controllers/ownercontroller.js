const Owner = require("../models/owner");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Property = require("../models/property");

module.exports.profile = async function (req, res) {
  try {
    let properties = await Property.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "bids",
        populate: {
          path: "user",
        },
      });

    let user = await Owner.findById(req.params.id);

    return res.render("owner_profile", {
      title: "FindMyHome || OwnerProfile",
      properties: properties,
      owner_user: user,
    });
  } catch (err) {
    console.log("Error", err);
    return res.redirect("back");
  }
};

module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  if (req.xhr) {
    return;
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
      req.flash("error", "User already exist");
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
        let hash = await bcrypt.hash(req.body.password, 10);

        let owner = await Owner.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          phone: req.body.phone,
          place: req.body.place,
        });

        if (req.xhr) {
          return res.status(200).json({
            data: {
              owner: owner,
            },
            message: "User created successfully",
          });
        }
        req.flash("success", "User created successfully");
        return res.redirect("/owner/signin");
      } else {
        req.flash("error", "User already exist with phone or email");
        return res.redirect("/owner/signin");
      }
    }
  } catch (err) {
    console.log("error in creating a user", err);
    return res.redirect("back");
  }
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      //find owner by id
      let owner = await Owner.findById(req.params.id);

      //owner update function
      Owner.uploadedimage(req, res, function (err) {
        if (err) {
          console.log("Error in updating a profile", err);
        }
        owner.name = req.body.name;
        owner.email = req.body.email;

        if (req.file) {
          if (owner.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", owner.avatar));
          }
          owner.avatar = Owner.avatarPath + "/" + req.file.filename;
        }
        owner.save();
      });

      //when xhr request accept then send this data
      if (req.xhr) {
        return res.status(200).json({
          data: {
            owner: owner,
          },
          message: "Owner profile update successfully",
        });
      }
      // return res.redirect("back");
    } catch (err) {
      console.log("error", err);
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
