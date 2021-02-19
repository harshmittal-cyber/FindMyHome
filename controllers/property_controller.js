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
        console.log("Érror in creating a property post");
        return;
      }
      return res.redirect("back");
    }
  );
};
