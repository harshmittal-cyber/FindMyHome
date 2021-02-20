const Property = require("../models/property");

module.exports.createproperty = function (req, res) {
  Property.create(
    {
      text: req.body.text,
      place: req.body.place,
      price: req.body.price,
      user: req.user._id,
    },
    function (err, user) {
      if (err) {
        console.log("Érror in creating a property post", err);
        return;
      }
      req.flash("success", "Property Listed Successfully");
      return res.redirect("back");
    }
  );
};

module.exports.destroy = function (req, res) {
  //TODO later
  Property.findByIdAndRemove({ _id: req.params.id }, function (err, property) {
    if (err) {
      console.log("Error in deleting a property", err);
      return res.redirect("back");
    }
    req.flash("success", "Property Deleted Successfully");
    return res.redirect("back");
  });
};
