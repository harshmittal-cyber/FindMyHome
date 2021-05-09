const Bid = require("../models/bid");
const Property = require("../models/property");

module.exports.createBid = async function (req, res) {
  try {
    let property = await Property.findById(req.body.property);

    if (property) {
      let bid = await Bid.create({
        text: req.body.text,
        property: req.body.property,
        user: req.user._id,
      });
      if (req.xhr) {
        bid = await bid.populate("user").execPopulate();
        console.log(bid);
        return res.status(200).json({
          data: {
            bid: bid,
          },
          message: "Bid Created successfully",
        });
      }
      property.bids.push(bid);
      property.save();

      req.flash("success", "Your Bid created successfully");

      return res.redirect("back");
    }
  } catch (err) {
    console.log("error", err);
    return res.redirect("back");
  }
};

module.exports.destroyBid = async function (req, res) {
  try {
    let bid = await Bid.findById(req.params.id);

    if (bid.user == req.user.id) {
      bid.remove();

      let propertyId = await bid.property;

      let property = await Property.findByIdAndUpdate(propertyId, {
        $pull: { bids: req.params.id },
      });

      req.flash("success", "Your Bid deleted successfully");
      return res.redirect("back");
    } else {
      req.flash("error", "Invalid User");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error", err);
    return res.redirect("back");
  }
};

module.exports.status = async function (req, res) {
  try {
    if (req.query.type == "Accepted") {
      let bid = Bid.findByIdAndUpdate(
        req.query.id,
        {
          status: req.query.type,
        },
        function (err, bid) {
          console.log("Status updated");
          bid.save();
        }
      );
      return res.status(200).json({
        bid: bid,
      });
    } else if ((req.query.type = "Rejected")) {
      let bid = Bid.findByIdAndUpdate(
        req.query.id,
        {
          status: req.query.type,
        },
        function (err, bid) {
          console.log("Status updated");
          bid.save();
        }
      );
      return res.status(200).json({
        bids: bid,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
