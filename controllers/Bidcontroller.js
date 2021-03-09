const { localsName } = require("ejs");
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

          property.bids.push(bid);

          property.save();
          req.flash("success", "Your Bid Published successfully");

          return res.redirect("back");
        }
      );
    }
  });
};

module.exports.destroyBid = function (req, res) {
  Bid.findById(req.params.id, function (err, bid) {
    //check if bid creator is equal to req.user or not
    if (bid.user == req.user.id) {
      bid.remove();

      let propertyId = bid.property;
      // Update the property and remove the bid from proeprty
      Property.findByIdAndUpdate(
        propertyId,
        { $pull: { bids: req.params.id } },
        function (err) {
          req.flash("success", "Your Bid Deleted Successfully");
          return res.redirect("back");
        }
      );
    } else {
      req.flash("érror", "Invalid User");
      return res.redirect("back");
    }
  });
};
