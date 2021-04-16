const Property = require("../models/property");
const Bid = require("../models/bid");

module.exports.createproperty = async function (req, res) {
  try {
    let property = await Property.create({
      text: req.body.text,
      place: req.body.place,
      price: req.body.price,
      user: req.user._id,
    });
    //if req is xmlhttprequest the show the data
    if (req.xhr) {
      property = await property.populate("user", "-password").execPopulate();
      return res.status(200).json({
        data: {
          property: property,
        },

        message: "Property Listed successfully",
      });
    }
    req.flash("success", "Property Listed Successfully");
    return res.redirect("back");
  } catch (err) {
    console.log("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let property = await Property.findById(req.params.id);

    if (property.user == req.user.id) {
      property.remove();

      let bid = await Bid.deleteMany({ property: req.params.id });
      console.log(req.params.id);
      if (req.xhr) {
        return res.status(200).json({
          data: {
            property_id: req.params.id,
          },
        });
      }
      req.flash("success", "Property Deleted Successfully");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot Delete this Property");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", "Internal Server error");
    return res.redirect("back");
  }
};
