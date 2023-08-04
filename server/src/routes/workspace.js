const express = require("express");
const router = express.Router();
const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');
const { runAsUser, pagingParams } = require('../util/request');
const ProductService = require('../services/product-service');
const productService = new ProductService();
const WorkspaceService = require('../services/workspace');
const workspaceService = new WorkspaceService();

router.get('/workspace/drafts', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a page of draft products created by the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfProducts'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const {perPage, page, skip, sortDir} = pagingParams(req);

    try {
      const pageOfDrafts = await productService.findPageOfDraftProductsForUser(currentUser.id, page, perPage, skip, sortDir);
      res.json(pageOfDrafts);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(500, `Unable to find draft products: ${error.message}`, res);
    }
  });
});

router.get('/workspace/recent', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a page of most recently published products created by the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfProducts'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const {perPage, page, skip, sortDir} = pagingParams(req);

    try {
      const pageOfRecentProducts = await productService.findPageOfRecentProductsForUser(currentUser.id, page, perPage, skip, sortDir);
      res.json(pageOfRecentProducts);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(500, `Unable to find posted products: ${error.message}`, res);
    }
  });
});

router.get('/workspace/stats', (req, res) => {
  /*
    #swagger.summary = "Retrieve stats on current user's products. NOT IMPLEMENTED!"
    #swagger.tags = ['Workspace']
   */

  // TODO: Need to implement search for stats. This is here to stub out the call.
  res.json([]);
});

router.get('/workspace/products', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a page of products created by the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfProducts'
      }
    }
    #swagger.responses[500] = {
      schema: {
        $ref: '#/definition/StandardError'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const {perPage, page, skip, sortDir} = pagingParams(req);

    try {
      const pageOfProducts = await productService.findPageOfProductsForUser(currentUser.id, page, perPage, skip, sortDir);
      res.json(pageOfProducts);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(500, `Unable to find user's products: ${error.message}`, res);
    }
  });
});

router.get('/workspace/saved', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a page of saved products by the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfSavedProducts'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const {perPage, page, sortDir} = pagingParams(req);
    const term = req.query.text;
    const filters = req.query;

    const savedProducts = await workspaceService.findPageOfSavedProductsForUser(currentUser.id, term, perPage, page, sortDir, filters);
    res.json(savedProducts);
  });
});

router.get('/workspace/savedall', async (req, res) => {
  /*
    #swagger.summary = 'Retrieve a page of recently saved productd'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfSavedProducts'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const {perPage, page, skip, sortDir} = pagingParams(req);

    const savedProductsAll = await productService.findPageOfSavedProducts(currentUser.id, page, perPage, skip, sortDir);
    res.json(savedProductsAll);
  });
});

router.put('/workspace/saved/:productId', async (req, res) => {
  /*
    #swagger.summary = 'Saves a product for the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/SavedProduct'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const savedProduct = await workspaceService.createSavedProduct(req.params.productId, currentUser.id);
    res.json(savedProduct);
  });
});

router.delete('/workspace/saved/:productId', async (req, res) => {
  /*
    #swagger.summary = 'Deletes a saved product for the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[204] = {
      schema: {
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    await workspaceService.deleteSavedProduct(req.params.productId, 1);
    res.status(204).send();
  });
});

router.get('/workspace/collections', async (req, res) => {
  /*
    #swagger.summary = 'Retrieves a page of collections for the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfCollections'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const {perPage, page, skip, sortDir} = pagingParams(req);

    const collections = await workspaceService.findPageOfCollectionsForUser(currentUser.id, page, perPage, skip, sortDir);
    res.json(collections);
  });
});

router.post('/workspace/collections', async (req, res) => {
  /*
    #swagger.summary = 'Creates a collection for saved products for the current user'
    #swagger.tags = ['Workspace']
    #swagger.requestBody = {
      schema: {
        $ref: '#/definitions/NewCollection'
      }
    }
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Collection'
      }
    }
   */

  await runAsUser(req, res, async (currentUser, req, res) => {
    const savedCollection = await workspaceService.createCollection({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      createdBy: currentUser.id,
    })

    res.json(savedCollection);
  });
});

router.put('/workspace/collections/:collectionId', async (req, res) => {
  /*
    #swagger.summary = 'Updates a collection for saved products for the current user'
    #swagger.tags = ['Workspace']
    #swagger.requestBody = {
      schema: {
        $ref: '#/definitions/NewCollection'
      }
    }
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Collection'
      }
    }
   */

  const updatedCollection = await workspaceService.updateCollection(req.params.collectionId, {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });

  res.json(updatedCollection);
});

router.delete('/workspace/collections/:collectionId', async (req, res) => {
  /*
    #swagger.summary = 'Deletes a collection'
    #swagger.tags = ['Workspace']
    #swagger.responses[204] = {
      schema: {
      }
    }
   */

  await workspaceService.deleteCollection(req.params.collectionId);
  res.status(204).send();
});

router.get('/workspace/collections/:collectionId/products', async (req, res) => {
  /*
    #swagger.summary = 'Retrieves a list of saved products for the given collection for the current user'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/PageOfSavedProducts'
      }
    }
   */

  const {perPage, page, sortDir} = pagingParams(req);
  const term = req.query.text;
  const filters = req.query;

  const savedProducts = await workspaceService.findSavedProductsInCollection(req.params.collectionId, term, perPage, page, sortDir, filters);
  res.json(savedProducts);
});

router.put('/workspace/collections/:collectionId/products/:savedProductId', async (req, res) => {
  /*
    #swagger.summary = 'Adds a saved product to a given collection'
    #swagger.tags = ['Workspace']
    #swagger.responses[200] = {
      schema: {
        $ref: '#/definitions/Collection'
      }
    },
    #swagger.responses[404] = {
      schema: {
        $ref: '#/definitions/StandardError'
      }
    }
   */

  const collection = await workspaceService.addSavedProductToCollection(req.params.collectionId, req.params.savedProductId);

  if (collection) {
    KiwiStandardResponsesExpress.standardPutResponse(collection, res);
  } else {
    KiwiStandardResponsesExpress.standardNotFoundResponse('Unable to find collection or saved product. Unable to add saved product to collection.', res);
  }
});

router.delete('/workspace/collections/:collectionId/products/:savedProductId', async (req, res) => {
  /*
    #swagger.summary = 'Removes a saved product to a given collection'
    #swagger.tags = ['Workspace']
    #swagger.responses[204] = {
      schema: {
      }
    },
    #swagger.responses[404] = {
      schema: {
        $ref: '#/definitions/StandardError'
      }
    }
   */

  const collection = await workspaceService.removeSavedProductFromCollection(req.params.collectionId, req.params.savedProductId);

  if (collection) {
    KiwiStandardResponsesExpress.standardDeleteResponseWithEntity(collection, res);
  } else {
    KiwiStandardResponsesExpress.standardNotFoundResponse('Unable to find collection or saved product. Unable to remove saved product from collection.', res);
  }
});

module.exports = router;
