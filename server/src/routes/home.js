const express = require("express");
const router = express.Router();

const Article = require("../models/articles");

// GET home page features
router.get("/features", (req, res) => {
  Article.find(
    {},
    "attributes doc_num title title_classification summary summary_classification date_published state",
    function (error, articles) {
      if (error) {
        console.error(error);
      }
      res.send({
        featured: articles,
        briefs: [], //TODO: need to only return sit awareness
      });
    }
  ).sort({ _id: -1 });
});

module.exports = router;
