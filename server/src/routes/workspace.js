const express = require("express");
const router = express.Router();
const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');
const { runAsUser, pagingParams } = require('../util/request');
const ProductService = require('../services/product-service');
const productService = new ProductService();
const WorkspaceService = require('../services/workspace');
const workspaceService = new WorkspaceService();

router.get("/drafts", async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { perPage, page, skip, sortDir } = pagingParams(req);

    try {
      const pageOfDrafts = await productService.findPageOfDraftProductsForUser(currentUser.id, page, perPage, skip, sortDir);
      res.json(pageOfDrafts);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(500, `Unable to find draft products: ${error.message}`, res);
    }
  });
});

router.get("/recent", async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { perPage, page, skip, sortDir } = pagingParams(req);

    try {
      const pageOfRecentProducts = await productService.findPageOfRecentProductsForUser(currentUser.id, page, perPage, skip, sortDir);
      res.json(pageOfRecentProducts);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(500, `Unable to find posted products: ${error.message}`, res);
    }
  });
});

router.get("/stats", (req, res) => {
  // TODO: Need to implement search for stats. This is here to stub out the call.
  res.json([]);
});

router.get("/products", async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { perPage, page, skip, sortDir } = pagingParams(req);

    try {
      const pageOfProducts = await productService.findPageOfProductsForUser(currentUser.id, page, perPage, skip, sortDir);
      res.json(pageOfProducts);
    } catch (error) {
      KiwiStandardResponsesExpress.standardErrorResponse(500, `Unable to find user's products: ${error.message}`, res);
    }
  });
});

router.get("/saved", async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { perPage, page, skip, sortDir } = pagingParams(req);

    // TODO: We need to figure out how to return the actual products
    const savedProducts = await workspaceService.findPageOfSavedProductsForUser(currentUser.id, page, perPage, skip, sortDir);
    res.json(savedProducts);
  });
});

router.put("/saved/:productId", async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    const savedProduct = await workspaceService.createSavedProduct(req.params.productId, currentUser.id);
    res.json(savedProduct);
  });
});

router.delete("/saved/:productId", async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    await workspaceService.deleteSavedProduct(req.params.productId, 1);
    res.status(204).send();
  });
});

router.get('/collections', async (req, res) => {
  await runAsUser(req, res, async (currentUser, req, res) => {
    const { perPage, page, skip, sortDir } = pagingParams(req);

    const collections = await workspaceService.findPageOfCollectionsForUser(currentUser.id, page, perPage, skip, sortDir);
    res.json(collections);
  });
});

router.post('/collections', async (req, res) => {
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

router.put('/collections/:collectionId', async (req, res) => {
  const updatedCollection = await workspaceService.updateCollection(req.params.collectionId, {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });

  res.json(updatedCollection);
});

router.delete("/collections/:collectionId", async (req, res) => {
  await workspaceService.deleteCollection(req.params.collectionId);
  res.status(204).send();
});

router.get('/collections/:collectionId/products', async (req, res) => {
  const savedProducts = await workspaceService.findSavedProductsInCollection(req.params.collectionId);
  KiwiStandardResponsesExpress.standardGetResponseWithMessage(savedProducts, `Unable to find collection with id ${req.params.collectionId}`, res);
});

router.put('/collections/:collectionId/products/:savedProductId', async (req, res) => {
  const collection = await workspaceService.addSavedProductToCollection(req.params.collectionId, req.params.savedProductId);

  if (collection) {
    KiwiStandardResponsesExpress.standardPutResponse(collection, res);
  } else {
    KiwiStandardResponsesExpress.standardNotFoundResponse('Unable to find collection or saved product. Unable to add saved product to collection.', res);
  }
});

router.delete('/collections/:collectionId/products/:savedProductId', async (req, res) => {
  const collection = await workspaceService.removeSavedProductFromCollection(req.params.collectionId, req.params.savedProductId);

  if (collection) {
    KiwiStandardResponsesExpress.standardDeleteResponseWithEntity(collection, res);
  } else {
    KiwiStandardResponsesExpress.standardNotFoundResponse('Unable to find collection or saved product. Unable to remove saved product from collection.', res);
  }
});

module.exports = router;
