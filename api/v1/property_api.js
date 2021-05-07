const Bid = require("../../models/bid");
const Property = require("../../models/property");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

module.exports.index = async function (req, res) {
  try {
    let property = await Property.find({})
      .sort("-createdAt")
      .populate("user", "-password")
      .populate({
        path: "bids",
        populate: {
          path: "user",
        },
      });

    return res.status(200).json({
      property: property,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Error in Property creation",
    });
  }
};

module.exports.createproperty = async function (req, res) {
  try {
    let property = await Property.create({
      text: req.body.text,
      place: req.body.place,
      price: req.body.price,
      //   user: req.user._id,
    });
    return res.status(200).json({
      token: jwt.sign(property.toJSON(), env.jwt_secretOrKey, {
        expiresIn: "600000",
      }),
      data: {
        property: property,
      },
      message: "Property Created",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let property = await Property.findById(req.params.id);

    property.remove();

    let bid = await Bid.deleteMany({ property: req.params.id });

    return res.status(200).json({
      message: "Property Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
      message: "Internal server Error",
    });
  }
};
