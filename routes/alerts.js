var express = require("express");
var router = express.Router();

var Alerts = require("../models/alerts");

// GET
router.get("/list", (req, res) => {
  Alerts.find({}, function (error, alerts) {
    if (error) {
      console.error(alerts);
    }
    res.send(alerts);
  });
});

module.exports = router;
