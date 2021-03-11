const Property = require("../models/property");
const Bid = require("../models/bid");

module.exports.createproperty = function (req, res) {
  Property.create(
    {
      text: req.body.text,
      place: req.body.place,
      price: req.body.price,
      user: req.user._id,
    },
    function (err, property) {
      if (err) {
        console.log("Érror in creating a property ", err);
        return res.redirect("back");
      }
      req.flash("success", "Property Listed Successfully");
      return res.redirect("back");
    }
  );
};

module.exports.destroy = async function (req, res) {
  try {
    let property = await Property.findById(req.params.id);

    if (property.user == req.user.id) {
      property.remove();

      let bid = await Bid.deleteMany({ property: req.params.id });

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
