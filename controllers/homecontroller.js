const Property = require("../models/property");
const Owner = require("../models/owner");

module.exports.home = async function (req, res) {
  try {
    let properties = await Property.find({})
      .sort("-createdAt")
      .populate("user", "-password")
      .populate({
        path: "bids",
        populate: {
          path: "user",
        },
      });

    let owner = await Owner.find({});

    return res.render("home", {
      title: "FindMyHome || Home",
      properties: properties,
      owner: owner,
    });
  } catch (err) {
    console.log("Error", err);
    return res.redirect("back");
  }
};
