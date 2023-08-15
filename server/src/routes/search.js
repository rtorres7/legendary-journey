const express = require("express");
const router = express.Router();

const ProductSearchService = require("../services/product-search-service");
const {runAsUser} = require('../util/request');
const searchService = new ProductSearchService(process.env.ES_URL);
const WorkspaceService = require("../services/workspace");
const workspaceService = new WorkspaceService();

router.get('/search', async (req, res) => {
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
    const term = req.query.text;
    const results = await searchService.search(term, req.query.per_page, req.query.page, req.query.sort_dir, req.query);

    for (let product of results.results) {
      await augmentProductWithSaved(product, currentUser.id, product.id);
    }
    res.json(results);
  });
});

router.get('/relatedSearch/:id', async (req, res) => {
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

  const results = await searchService.relatedSearch(req.params.id);
  res.json(results);
});

async function augmentProductWithSaved(productData, currentUserId, productId) {
  productData.saved = await workspaceService.isProductSaved(
    currentUserId,
    productId,
  );
}

module.exports = router;
