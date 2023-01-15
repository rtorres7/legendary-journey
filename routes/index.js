var express = require("express");
var router = express.Router();

var Metadata = require("../models/metadata");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/metadata", function (req, res) {
  Metadata.findOne({}, function (error, metadata) {
    if (error) {
      console.error(error);
    }
    res.send({ metadata });
  });
});
module.exports = router;
