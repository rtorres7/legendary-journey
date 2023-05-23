const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const Article = require("../models/articles");
const SpecialEditions = require("../models/special_editions");
const DissemOrgs = require("../models/dissem_orgs");

const IndexService = require("../services");
const { handleMongooseError } = require("../util/errors");
const indexService = new IndexService();

router.get("/:date_published/articles/:id/getDocumentData", (req, res) => {
  res.redirect(`/articles/${req.params.id}/edit`);
});

router.get("/get_dissem_orgs", function (req, res) {
  DissemOrgs.find({}, function (error, dissem_orgs) {
    if (error) {
      console.error(error);
    }
    res.send({ dissem_orgs });
  });
});

router.get("/documents/:id.json", function (req, res) {
  res.redirect(`/articles/${req.params.id}`);
});

router.get("/user_data", function (req, res) {
  res.redirect("/users/");
});

router.get("/links", function (req, res) {
  SpecialEditions.findOne({}, function (error, special_editions) {
    if (error) {
      console.error(error);
    }
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
      readership: {},
      uniqueReadership: {},
    },
  });
});

// TODO: Should update from a RESTful POST to a DELETE in high app
//       then we can just redirect to /article/:id for delete
// TODO: Need to update the client to send the product ID instead
//       of the productNumber
// TODO: Should we evaluate a broader data access
//       service for the purpose of enforcing (at a lower level)
//       keeping data stores (like ES and MongoDB) in-sync?
router.post("/:id/deleteMe", async (req, res) => {
  try {
    const deletedItem = await Article.findOneAndDelete({
      productNumber: req.params.id,
    });
    if (!deletedItem) {
      return res.status(200).send({ error: "Item not found in MongoDB" });
    }

    try {
      await indexService.delete(deletedItem.id);
      return res.status(200).send(deletedItem);
    } catch (err) {
      return res.status(200).send({ error: err.message });
    }
  } catch (err) {
    res.status(200).send({ error: err.message });
  }
});

module.exports = router;
