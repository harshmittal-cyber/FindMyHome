const Owner = require("../../../models/owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            token: jwt.sign(owner.toJSON(), "findmyhome", {
              expiresIn: "600000",
            }),
            data: owner,
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
