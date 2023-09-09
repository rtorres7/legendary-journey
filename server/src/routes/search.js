const express = require("express");
const router = express.Router();

const ProductSearchService = require("../services/product-search-service");
const { runAsUser } = require("../util/request");
const { config } = require("../config/config");
const searchService = new ProductSearchService(config.elasticsearch.url);
const WorkspaceService = require("../services/workspace");
const workspaceService = new WorkspaceService();
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");
const { logger } = require("../config/logger");

router.get("/search", async (req, res) => {
  /*
    #swagger.tags = ['Search']
    #swagger.summary = 'Runs a search for products'
    #swagger.parameters['text'] = {
      description: 'The search term',
      type: 'string'
    }
    #swagger.parameters['per_page'] = {
      description: 'The number of records per page to return',
      type: 'number'
    }
    #swagger.parameters['page'] = {
      description: 'The page number to return',
      type: 'number'
    }
    #swagger.parameters['sort_dir'] = {
      description: 'The sort direction',
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/SearchResults'
      }
    }
 */

  await runAsUser(req, res, async (currentUser, req, res) => {
    try {
      const term = req.query.text;
      const results = await searchService.search(
        term,
        req.query.per_page,
        req.query.page,
        req.query.sort_dir,
        req.query,
      );

      for (let product of results.results) {
        await augmentProductWithSaved(product, currentUser.id, product.id);
      }
      res.json(results);
    } catch (error) {
      logger.error(error);
      const errorDetails = `${error.message}`;
      KiwiStandardResponsesExpress.standardErrorResponse(
        500,
        errorDetails,
        res,
      );
    }
  });
});

router.get("/relatedSearch/:id", async (req, res) => {
  /*
    #swagger.tags = ['Search']
    #swagger.summary = 'Runs a search for related products'
    #swagger.parameters['id'] = {
      description: 'The Document Product Number',
      type: 'string'
    }
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/ProductDocument'
      }
    }
 */
  try {
    const results = await searchService.relatedSearch(req.params.id);
    res.json(results);
  } catch (error) {
    logger.error(error);
    const errorDetails = `${error.message}`;
    KiwiStandardResponsesExpress.standardErrorResponse(500, errorDetails, res);
  }
});

async function augmentProductWithSaved(productData, currentUserId, productId) {
  productData.saved = await workspaceService.isProductSaved(
    currentUserId,
    productId,
  );
}

module.exports = router;
