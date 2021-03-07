const Bid = require("../models/bid");
const Property = require("../models/property");

module.exports.createBid = function (req, res) {
  Property.findById(req.body.property, function (err, property) {
    if (err) {
      console.log("error in creating a Bid", err);
      return res.redirect("back");
    }
    if (property) {
      Bid.create(
        {
          text: req.body.text,
          property: req.body.property,
          user: req.user._id,
        },
        function (err, bid) {
          if (err) {
            console.log("Error in creating a Bid", err);
          }
          console.log("user", bid.user._id);
          console.log("bid id", bid._id);
          property.bids.push(bid);

          property.save();
          req.flash("success", "Your Bid Published successfully");

          return res.redirect("back");
        }
      );
    }
  });
};

module.exports.destroyBid = function (req, res) {};
