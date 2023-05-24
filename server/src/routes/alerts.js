const express = require("express");
const router = express.Router();

router.get("/list", (req, res) => {
  // TODO: Need to implement alert models. This is here to stub out the call.
  res.json([]);
});

module.exports = router;
