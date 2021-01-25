module.exports.home = function (req, res) {
  console.log("cookie", req.cookies);
  return res.render("home", {
    title: "FindMyHome || Home",
  });
};
