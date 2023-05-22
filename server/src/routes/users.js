const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { handleMongooseError } = require("../util/errors");

// GET
router.get("/", (req, res) => {
  User.findOne({}, function (error, user) {
    handleMongooseError("Error finding User", error);
    res.send(user);
  });
});

module.exports = router;
