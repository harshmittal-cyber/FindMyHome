const Bid = require("../../models/bid");
const Property = require("../../models/property");

module.exports.index = async function (req, res) {
  try {
    let property = await Property.find({});

    return res.status(200).json({
      data: property,
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
      data: {
        property: property,
      },
      message: "Property Created",
    });
  } catch (err) {
    return res.status(401).json({
      message: "Error in creating a property",
    });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let property = await Property.findById(req.params.id);

    if (property.user == req.user.id) {
      property.remove();

      let bid = await Bid.deleteMany({ property: req.params.id });

      return res.status(200).json({
        message: "Property Deleted Successfully",
      });
    } else {
      return res.status(401).json({
        message: "User Not matched. You cannot delete this property",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server Error",
    });
  }
};
