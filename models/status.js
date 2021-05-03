const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
  },
  //object id whose status is set
  status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending"],
    default: "Pending",
    ref: "Bid",
  },
});

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
