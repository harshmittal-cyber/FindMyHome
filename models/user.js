const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const IMG_PATH = path.join("/images/users/avatar");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      min: 6000000000,
      max: 9999999999,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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

UserSchema.statics.uploadedimage = multer({ storage: storage }).single(
  "avatar"
);
UserSchema.statics.avatarPath = IMG_PATH;

const User = mongoose.model("User", UserSchema);

module.exports = User;
