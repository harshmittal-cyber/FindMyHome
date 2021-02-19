const User = require("../models/user");
const Owner = require("../models/owner");
const bcrypt = require("bcrypt");
const Property = require("../models/property");

module.exports.home = function (req, res) {
  // Property.find({}, function (err, properties) {
  //   return res.render("home", {
  //     title: "FindMyHome || Home",
  //     properties: properties,
  //   });
  // });

  Property.find({})
    .populate("user", "name")
    .exec(function (err, properties) {
      return res.render("home", {
        title: "FindMyHome || Home",
        properties: properties,
      });
    });
};
