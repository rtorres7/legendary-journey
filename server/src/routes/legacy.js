const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const SpecialEditions = require("../models/special_editions");
const DissemOrgs = require("../models/dissem_orgs");

router.get("/:date_published/articles/:id/getDocumentData", (req, res) => {
  res.redirect(`/articles/${req.params.id}/edit`);
});

router.get("/get_dissem_orgs", function (req, res) {
  DissemOrgs.find({}, function (error, dissem_orgs) {
    res.send({ dissem_orgs });
  });
});

router.get("/documents/:id.json", function (req, res) {
  res.redirect(`/articles/${req.params.id}`);
});

router.get("/:id/preview.json", function (req, res) {
  res.redirect(`/articles/${req.params.id}`);
});

router.get("/user_data", function (req, res) {
  res.redirect("/auth/profile");
});

router.get("/links", function (req, res) {
  SpecialEditions.findOne({}, function (error, special_editions) {
    res.send(special_editions);
  });
});

router.get("/:doc_num", function (req, res) {
  res.redirect(`/articles/${req.params.doc_num}`);
});

router.get("/:date_published/getWireByDate", function (req, res) {
  res.redirect(`/articles/date/${req.params.date_published}`);
});

router.put("/:date_published/articles/:id/visitorCount", function (req, res) {
  res.status(200).json({
    success: true,
  });
});

router.get("/:doc_num/metrics/basic_metrics.json", function (req, res) {
  res.send({
    metrics: {
      readership: [],
      uniqueReadership: {},
    },
  });
});

// TODO: This will go away once the UI changes to use DELETE /articles/:id
router.delete("/:id/deleteMe", async (req, res) => {
  res.redirect(307, `/articles/${req.params.id}`);
});

module.exports = router;
