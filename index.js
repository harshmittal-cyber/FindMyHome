const express = require("express");
const env = require("./config/env");
const logger = require("morgan");
const app = express();
const helper = require("./config/view-helpers")(app);
const port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const connect = require("connect");
const bcrypt = require("bcrypt");
const sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//for cookies
app.use(cookieParser());

if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: false,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}
//for layouts
app.use(express.static(env.asset_path));
app.use("/images", express.static(__dirname + "/images"));
app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);

//extract the styles
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//view engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "findmyhome",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 2 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "mongo store session cookie");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(passport.authenticate("passport-one-session-per-user"));
//for connect-flash msgs
app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes/index"));
//api routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
});

app.use("/api", require("./api_routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server on port:${port}`);
  }
  console.log(env.name);
  console.log(`Server is running on port:${port}`);
});
