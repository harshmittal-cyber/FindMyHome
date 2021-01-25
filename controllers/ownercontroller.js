const { nextTick, exit } = require("process");
const Owner = require("../models/owner");
const User = require("../models/user");

module.exports.owner = function (req, res) {
  return res.send("Hi LandLord");
};

module.exports.signin = function (req, res) {
  return res.render("owner_signin", {
    title: "FindMyHome || Landlord",
  });
};

module.exports.signup = function (req, res) {
  return res.render("owner_signup.ejs");
};

module.exports.create = function (req, res) {
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
    if (req.body.phone < 1000000000) {
      return res.redirect("back");
    }
    //CREATE THE OWNER
    Owner.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        console.log("Error in finding the user", err);
      }

      if (!user) {
        //OWNER CREATED
        Owner.create(req.body, function (err, user) {
          if (err) {
            console.log("Error in creating user", err);
          }
          return res.redirect("/owner/signin");
        });
      } else {
        return res.redirect("/owner/signin");
      }
    });
  });
};
