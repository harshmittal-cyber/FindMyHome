const Property = require("../models/property");

module.exports.home = function (req, res) {
  Property.find({})
    .populate("user", "name")
    .exec(function (err, properties) {
      return res.render("home", {
        title: "FindMyHome || Home",
        properties: properties,
      });
    });
};
