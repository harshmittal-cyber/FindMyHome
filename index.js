const express = require("express");
const app = express();
const port = 4000;
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");

app.use(express.urlencoded({ extended: true }));

//for cookies
app.use(cookieParser());

//extract the styles
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//view engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server on port:${port}`);
  }
  console.log(`Server is running on port:${port}`);
});
