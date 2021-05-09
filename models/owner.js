const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const IMG_PATH = path.join("/images/owners/avatar");

const ownerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      min: 6000000000,
      max: 9999999999,
    },
    name: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: true,
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

ownerSchema.statics.uploadedimage = multer({
  storage: storage,
}).single("avatar");
ownerSchema.statics.avatarPath = IMG_PATH;

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
