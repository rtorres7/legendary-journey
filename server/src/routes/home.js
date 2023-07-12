const express = require("express");
const router = express.Router();

const ProductService = require('../services/product-service');
const productService = new ProductService();

const { handleMongooseError } = require("../util/errors");

// GET home page features
router.get('/home/features', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a list of features and briefs for the home page'
    #swagger.tags = ['Products']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/FeaturesAndBriefs'
      }
    }
   */

  try {
    const featuresAndBriefs = await productService.findFeaturesAndBriefs();
    res.json(featuresAndBriefs);
  } catch (error) {
    // TODO: Replace the following with kiwi-js#KiwiStandardResponses
    handleMongooseError('Unable to find features and briefs', error);
    res.json({error: 'Unable to find features and briefs'});
  }
});

module.exports = router;
