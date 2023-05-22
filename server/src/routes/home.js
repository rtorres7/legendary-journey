const express = require("express");
const router = express.Router();

const SearchService = require("../services/search.js");
const searchService = new SearchService();
const Article = require("../models/articles");

// GET home page features
router.get("/features", (req, res) => {
  Article.find(
    {},
    function (error, articles) {
      if (error) {
        console.error(error);
      }

      // TODO: We need a ticket to clean up all the classification fields this is UI and backend
      articles.forEach(article => {
        article.summary_classification = article.summary_classif;
        article.attributes.summary_classification = article.summary_classif;
        article.title_classification = article.title_classif;
        article.attributes.title_classification = article.title_classif;
      });

      (async() => {
        const results = await searchService.search('', 3, 1, 'desc', { product_types: [10377, 10379, 10380, 10384, 10385] });
        const briefs = results.hits.hits.map(hit => hit._source);

        // TODO: This is not a good solution, but I am having trouble getting a blank needed property added to the index
        briefs.forEach(brief => {
          brief.needed = brief.needed || {};
          brief.attributes = { ...brief };
        });

        res.send({
          featured: articles,
          briefs: briefs || [],
        });
      })();
    }
  ).sort({ _id: -1 });
});

module.exports = router;
