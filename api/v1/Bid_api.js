const { localsName } = require("ejs");
const e = require("express");
const Bid = require("../../models/bid");
const Property = require("../../models/property");
const jwt = require("jsonwebtoken");

module.exports.createBid = async function (req, res) {
  try {
    let property = await Property.findById(req.body.property);

    if (property) {
      let bid = await Bid.create({
        text: req.body.text,
        property: req.body.property,
        user: req.user._id,
      });

      property.bids.push(bid);
      property.save();

      return res.status(200).json({
        token: jwt.sign(bid.toJSON(), "findmyhome", {
          expiresIn: "600000",
        }),
        data: bid,
        message: "Bid created Successfully",
      });
    } else {
      return res.status(401).json({
        message: "You cannot Bid on unknown property",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.destroyBid = async function (req, res) {
  try {
    let bid = await Bid.findById(req.params.id);

    bid.remove();

    let propertyId = await bid.property;

    let property = await Property.findByIdAndUpdate(propertyId, {
      $pull: { bids: req.params.id },
    });

    return res.status(200).json({
      message: "Bid deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
