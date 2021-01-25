const User = require("../models/user");

module.exports.user = function (req, res) {
  return res.send("Hi Harsh");
};

module.exports.signin = function (req, res) {
  return res.render("user_signin");
};

module.exports.signup = function (req, res) {
  return res.render("user_signup");
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  if (req.body.phone < 1000000000) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding a user", err);
    }

    if (!user) {
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
};
