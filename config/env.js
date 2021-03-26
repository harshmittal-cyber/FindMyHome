const dotenv = require("dotenv").config();
const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

//log directory
const logDirectory = path.join(__dirname, "../loggers");
//if file is exist otheriwsie it create the logger file
fs.existsSync(logDirectory || fs.mkdir(logDirectory));
const accesslogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "findmyhome",
  db: "findmyhomes",
  jwt_secretOrKey: "findMyHome",
  morgan: {
    mode: "dev",
    options: { stream: accesslogStream },
  },
};

const production = {
  name: process.env.FINDMYHOME_ENVIRONMENT,
  asset_path: "./public/assets",
  db: process.env.FINDMYHOME_DB,
  session_cookie_key: process.env.FINDMYHOME_SESSION_COOKIE_KEY,
  jwt_secretOrKey: process.env.FINDMYHOME_JWT,
  morgan: {
    mode: "combined",
    options: { stream: accesslogStream },
  },
};

// module.exports = eval(
//   process.env.FINDMYHOME_ENVIRONMENT == undefined
//     ? development
//     : eval(process.env.FINDMYHOME_ENVIRONMENT)
// );
module.exports = development;
