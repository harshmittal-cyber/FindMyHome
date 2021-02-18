const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    place: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Land = mongoose.model("Land", propertySchema);

module.exports = Land;
