const Owner = require("../../models/owner");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

module.exports.createSession = async function (req, res) {
  try {
    //if body is of Lndlord then go in if section otherwise in else section
    if (req.body.isAdmin) {
      let owner = await Owner.findOne({ email: req.body.email });
      //if owner then return the owner otherwise signup the details of owner
      if (owner) {
        let result = await bcrypt.compare(req.body.password, owner.password);

        if (result) {
          return res.status(200).json({
            message: "Owner Signed In successfully",
            data: jwt.sign(owner.toJSON(), env.jwt_secretOrKey, {
              expiresIn: "600000",
            }),
          });
        }
      } else {
        //Owner not exist
        return res.status(422).json({
          message: "Invalid User || SIGN UP YOUR DETAILS",
        });
      }
    } else {
      let user = await User.findOne({ email: req.body.email });
      //if user exist then signin the user
      if (user) {
        let result = await bcrypt.compare(req.body.password, user.password);

        if (result) {
          return res.status(200).json({
            message: "User Signed In successfully",
            data: jwt.sign(user.toJSON(), env.jwt_secretOrKey, {
              expiresIn: "600000",
            }),
          });
        }
      } else {
        //signup the deails of user
        return res.status(422).json({
          message: "Invalid User || SIGN UP YOUR DETAILS",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
      message: "Internal server error",
    });
  }
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
  try {
    //checking if email is valid or not
    if (!validateEmail(req.body.email)) {
      return res.status(500).json({
        message: "Enter a valid email",
      });
    }
    //check if password is valid or not
    if (!validatePassword(req.body.password)) {
      return res.status(500).json({
        message:
          "Enter a strong password with different characters,alphabets and special symbols",
      });
    }
    //CHECK IF PASSWORD MATCH WITH CONFIRM PASSWORD OR NOT
    if (req.body.password != req.body.confirm_password) {
      return res.status(401).json({
        message: "Confirm password not matched",
      });
    }
    //CHECK IF MOBILE NO. IS OF 10 DIGITS OR NOT
    if (req.body.phone < 6000000000) {
      return res.status(401).json({
        message: "Invalid Mobile Number",
      });
    }
    //now check routes is of admin or not
    if (req.body.isAdmin) {
      //find the User
      let user = await User.findOne({ email: req.body.email });
      //if user exist the return if not then go into else section
      if (user) {
        return res.status(401).json({
          message: "User already exist as a buyer",
        });
      } else {
        //find the owner
        let owner = await Owner.findOne({ email: req.body.email });

        //if not owner the create the owner
        if (!owner) {
          let hash = await bcrypt.hash(req.body.password, 10);

          let ownercreate = await Owner.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            phone: req.body.phone,
            place: req.body.place,
          });

          //after creating save the owner
          ownercreate.save((err) => {
            if (err) {
              return next(err);
            }
            return res.status(200).json({
              message: "Owner created successfully",
            });
          });
        } else {
          //if owner exist then return status 401
          return res.status(401).json({
            message: "Owner already exist",
          });
        }
      }
    } else {
      let owner = await Owner.findOne({ email: req.body.email });

      if (owner) {
        return res.status(401).json({
          message: "User exist as a buyer",
        });
      } else {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
          let hash = await bcrypt.hash(req.body.password, 10);

          let usercreate = await User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            phone: req.body.phone,
          });

          usercreate.save((err) => {
            if (err) {
              return next(err);
            }
            return res.status(200).json({
              message: "User created successfully",
            });
          });
        } else {
          return res.status(401).json({
            message: "User already exist",
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({
      error: err,
      message: "Internal server error",
    });
  }
};
