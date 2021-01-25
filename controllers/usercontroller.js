const User = require("../models/user");
const Owner = require("../models/owner");
module.exports.user = function (req, res) {
  return res.send("Hi Harsh");
};

//rendering signin page
module.exports.signin = function (req, res) {
  return res.render("user_signin");
};

//renderring signup page
module.exports.signup = function (req, res) {
  return res.render("user_signup");
};

//Create a user
module.exports.create = function (req, res) {
  //FIND IF WE USER ALREADY EXIST AS A OWNER OR NOT
  Owner.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      return res.redirect("/owner/signin");
    }

    //CHECK IF PASSWORD MATCH WITH CONFIRM PASSWORD OR NOT
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }
    //CHECK IF MOBILE NO. IS OF 10 DIGITS OR NOT
    if (req.body.phone < 1000000000) {
      return res.redirect("back");
    }
    //CREATE A USER
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        console.log("Error in finding a user", err);
      }

      if (!user) {
        //USER CREATED
        User.create(req.body, function (err, user) {
          if (err) {
            console.log("Error in creating a user", err);
          }

          return res.redirect("/users/signin");
        });
      } else {
        return res.redirect("back");
      }
    });
  });
};
