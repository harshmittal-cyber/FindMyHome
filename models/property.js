const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const IMG_PATH = path.join("/images/property/avatar");

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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },
    price: {
      type: String,
      required: true,
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
    status: {
      sold: { type: Boolean, default: false, ref: "Bid" },
      Pending: { type: Boolean, default: true, ref: "Bid" },
    },
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", IMG_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

propertySchema.statics.uploadedimages = multer({ storage: storage }).single(
  "avatar"
);

propertySchema.statics.avatarPath = IMG_PATH;

const Land = mongoose.model("Land", propertySchema);

module.exports = Land;
