const Property = require("../models/property");
const Bid = require("../models/bid");

module.exports.createproperty = function (req, res) {
  Property.create(
    {
      text: req.body.text,
      place: req.body.place,
      price: req.body.price,
      user: req.user._id,
      // avatar: Property.uploadedimages(req, res, function (err) {
      //   if (err) {
      //     console.log("Multer error", err);
      //   }
      //   console.log(req.file);
      //   const file = req.file;
      //   if (file) {
      //     req.body.avatar = Property.avatarPath + "/" + req.file.filename;
      //   }
      // }),
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

module.exports.destroy = function (req, res) {
  Property.findById(req.params.id, function (err, property) {
    if (property.user == req.user.id) {
      property.remove();

      Bid.deleteMany({ property: req.params.id }, function (err) {
        req.flash("success", "Property Deleted successfully");
        return res.redirect("back");
      });
    } else {
      req.flash("error", "Invalid User");
      return res.redirect("back");
    }
  });
};
