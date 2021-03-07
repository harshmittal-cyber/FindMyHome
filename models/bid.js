const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    //which user bid on property
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //on which property user bid
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  },
  {
    timestamps: true,
  }
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
