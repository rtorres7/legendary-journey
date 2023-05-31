const express = require("express");
const router = express.Router();

const SearchService = require("../services/search.js");
const searchService = new SearchService(process.env.ES_URL);
const Article = require("../models/articles");
const { handleMongooseError } = require("../util/errors");

// GET home page features
router.get("/features", (req, res) => {
  Article.find(
    {},
    function (error, articles) {
      handleMongooseError("Unable to find articles", error);

      (async() => {
        const results = await searchService.search('', 3, 1, 'desc', { productTypes: [10377, 10379, 10380, 10384, 10385, 10386] });
        const briefs = results.hits.hits.map(hit => hit._source);

        addAttributesToBriefs(briefs);

        res.json({
          featured: articles.map(article => article.features),
          briefs: briefs || [],
        });
      })();
    }
  ).sort({ _id: -1 });
});

// TODO: This is needed until the UI has been updated with the new model/fields
function addAttributesToBriefs(briefs) {
  briefs.forEach(brief => {
    brief.attributes = {
      ...brief,
      date_published: brief.datePublished,
      doc_num: brief.productNumber,
      html_body: brief.htmlBody,
      needed: brief.needed && brief.needed.orgs && brief.needed.orgs.length > 0 ? brief.needed : {},
      org_restricted: brief.orgRestricted,
      summary_classification: brief.summaryClassification,
      summary_classif: brief.summaryClassification,
      title_classification: brief.titleClassification,
      title_classif: brief.titleClassification
    }
  })
}

module.exports = router;
