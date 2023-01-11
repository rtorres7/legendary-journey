var express = require("express");
var router = express.Router();

router.get("/daniel", function (req, res) {
  res.redirect("/articles/");
});

module.exports = router;
