const User = require("../models/user");
const Owner = require("../models/owner");
const bcrypt = require("bcrypt");

module.exports.home = function (req, res) {
  return res.render("home", {
    title: "FindMyHome || Home",
  });
};
