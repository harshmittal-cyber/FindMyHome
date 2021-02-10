const User = require("../../../models/user");
const Owner = require("../../../models/owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(422).json({
        message: "Invalid User || SIGN UP YOUR DETAILS",
      });
    }

    //if user fetched the detailes of tenant
    if (user) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        //if err occures show the error to the user
        if (err) {
          console.log("error", err);
          return res.status(400).json({
            message: "Bad connection check your internet connection",
          });
        }
        //if request is fetched then send the jwt token to the user
        return res.status(200).json({
          message: "Tenant signed in successfully",
          data: jwt.sign(user.toJSON(), "findmyhome", {
            expiresIn: "600000",
          }),
        });
      });
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({
      message: "Error in creating a session",
    });
  }
};
