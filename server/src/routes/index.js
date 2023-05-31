const express = require("express");
const router = express.Router();

const Metadata = require("../models/metadata");
const { handleMongooseError } = require("../util/errors");

router.get("/metadata", function (req, res) {
  Metadata.findOne({}, function (error, metadata) {
    handleMongooseError('Unable to load metadata', error);
    res.json({ metadata });
  });
});
module.exports = router;
