var express = require("express");
var router = express.Router();

var User = require("../models/user");

// GET
router.get("/", (req, res) => {
  User.findOne({}, function (error, user) {
    if (error) {
      console.error(error);
    }
    res.send(user);
  });
});

module.exports = router;
