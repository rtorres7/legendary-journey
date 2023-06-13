const express = require("express");
const router = express.Router();
const { handleMongooseError } = require("../util/errors");
const {KiwiStandardResponsesExpress} = require('@kiwiproject/kiwi-js');
const ProductService = require('../services/product-service');
const productService = new ProductService();
const WorkspaceService = require('../services/workspace');
const workspaceService = new WorkspaceService();

router.get("/drafts", async (req, res) => {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: Need to find user from request
  try {
    const pageOfDrafts = await productService.findPageOfDraftProductsForUser(1, page, perPage, skip, sortDir);
    res.json(pageOfDrafts);
  } catch (error) {
    handleMongooseError("Unable to find draft products", error);
    KiwiStandardResponsesExpress.standardErrorResponse(500, error, res);
  }
});

router.get("/recent", async (req, res) => {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: Need to find user from request
  try {
    const pageOfRecentProducts = await productService.findPageOfRecentProductsForUser(1, page, perPage, skip, sortDir);
    res.json(pageOfRecentProducts);
  } catch (error) {
    handleMongooseError("Unable to find posted products", error);
    KiwiStandardResponsesExpress.standardErrorResponse(500, error, res);
  }
});

router.get("/stats", (req, res) => {
  // TODO: Need to implement search for stats. This is here to stub out the call.
  res.json([]);
});

router.get("/products", async (req, res) => {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: Need to find user from request
  try {
    const pageOfProducts = await productService.findPageOfProductsForUser(1, page, perPage, skip, sortDir);
    res.json(pageOfProducts);
  } catch (error) {
    handleMongooseError("Unable to find user's products", error);
    KiwiStandardResponsesExpress.standardErrorResponse(500, error, res);
  }
});

router.get("/saved", async (req, res) => {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: We need user info so we can filter this by MY saved products
  // TODO: We need to figure out how to return the actual products
  const savedProducts = await workspaceService.findPageOfSavedProductsForUser(1, page, perPage, skip, sortDir);
  res.json(savedProducts);
});

router.put("/saved/:productId", async (req, res) => {
  // TODO: Need a real user
  const savedProduct = await workspaceService.createSavedProduct(req.params.productId, 1);
  res.json(savedProduct);
});

router.delete("/saved/:productId", async (req, res) => {
  // TODO: Need a real user
  await workspaceService.deleteSavedProduct(req.params.productId, 1);
  res.status(204).send();
});

router.get('/collections', async (req, res) => {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: We need real users so we can filter this by current user
  const collections = await workspaceService.findPageOfCollectionsForUser(1, page, perPage, skip, sortDir);
  res.json(collections);
});

router.post('/collections', async (req, res) => {
  const savedCollection = await workspaceService.createCollection({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    createdBy: 1 // TODO: We need a real user
  })

  res.json(savedCollection);
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
