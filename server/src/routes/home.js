const express = require("express");
const router = express.Router();

const ProductService = require('../services/product-service');
const productService = new ProductService();

const { handleMongooseError } = require("../util/errors");

// GET home page features
router.get("/features", async (req, res) => {
  try {
    const featuresAndBriefs = await productService.findFeaturesAndBriefs();
    addAttributesToBriefs(featuresAndBriefs.briefs);

    res.json(featuresAndBriefs);
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError('Unable to find features and briefs', error);
    res.json({ error: 'Unable to find features and briefs' });
  }
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
