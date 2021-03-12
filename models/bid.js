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
    status: {
      pending: { type: Boolean, default: true },
      accept: { type: Boolean, default: false },
      rejected: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
