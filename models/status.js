const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({});

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
