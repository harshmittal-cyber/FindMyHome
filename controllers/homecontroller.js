const Property = require("../models/property");

module.exports.home = function (req, res) {
  Property.find({})
    .populate("user")
    .populate({
      path: "bids",
      populate: {
        path: "user",
      },
    })
    .exec(function (err, properties) {
      return res.render("home", {
        title: "FindMyHome || Home",
        properties: properties,
      });
    });
};
