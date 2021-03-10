const express = require("express");
const app = express();
const port = 4000;
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const connect = require("connect");
const bcrypt = require("bcrypt");
const sassMiddleware = require("node-sass-middleware");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//for cookies
app.use(cookieParser());

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: false,
    outputStyle: "extended",
    prefix: "/css",
  })
);

//for layouts
app.use(express.static("./assets"));
app.use("/images", express.static(__dirname + "/images"));
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
    secret: "findmyhome",
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

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server on port:${port}`);
  }
  console.log(`Server is running on port:${port}`);
});
