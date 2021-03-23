const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// mongoose.connect("mongodb://localhost/findmyhomes");
mongoose.connect(
  "mongodb+srv://harsh_mittal18:M9o6hPRPVBEWhixr@findmyhomes.irc4s.mongodb.net/findmyhomes?retryWrites=true&w=majority"
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Server is connected to Database");
});

module.exports = db;
