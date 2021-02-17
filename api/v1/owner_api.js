const Owner = require("../../models/owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports.createSession = async function (req, res) {
  try {
    let owner = await Owner.findOne({ email: req.body.email });
    if (owner) {
      bcrypt.compare(req.body.password, owner.password, function (err, result) {
        //if err occures show the error to the user
        if (err) {
          console.log("error", err);
          return res.status(400).json({
            message: "Bad connection check your internet connection",
          });
        }

        //if no result fetched then user is invalid
        if (!result) {
          return res.status(422).json({
            message: "Invalid user",
          });
        } else {
          //if request is fetched then send the jwt token to the user
          return res.status(200).json({
            message: "Land Owner signed in successfully",
            data: owner,
            token: jwt.sign(owner.toJSON(), "findmyhome", {
              expiresIn: "600000",
            }),
          });
        }
      });
    } else {
      return res.status(422).json({
        message: "Invalid User || SIGN UP YOUR DETAILS",
      });
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({
      message: "Error in creating a session",
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
  //FIND IF WE USER ALREADY EXIST AS A OWNER OR NOT
  try {
    const email = req.body.email;
    const password = req.body.password;

    //checking if email is valid or not
    if (!validateEmail(email)) {
      return res.status(500).json({
        message: "Enter a valid email",
      });
    }

    if (!validatePassword(password)) {
      return res.status(500).json({
        message:
          "Enter a strong password with different characters,alphabets and special symbols",
      });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(401).json({
        message: "User already exist",
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
                return res.status(500).send(`Error in creating a user ${err}`);
              }
              return res.status(200).json({
                message: "User created successfully",
              });
            }
          );
        });
      } else {
        return res.status(401).json({
          message: "User already exist",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: `Error in creating a user ${err}`,
    });
  }
};