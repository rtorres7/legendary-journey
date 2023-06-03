const express = require("express");
const router = express.Router();
const { models } = require('../db/sequelize');
const Article = require("../models/articles");
const { handleMongooseError } = require("../util/errors");

router.get("/drafts", (req, res) => {
  // TODO: Need to limit this based on current user
  Article.find({ state: 'draft' }, (errors, articles) => {
    handleMongooseError("Unable to find draft articles", errors);

    res.json(articles.map((article) => article.features));
  });
});

router.get("/recent", (req, res) => {
  Article.find({ state: 'posted' }, (errors, articles) => {
    handleMongooseError("Unable to find posted articles", errors);

    res.json(articles.map((article) => article.features));
  }).sort({ datePublished: -1 });
});

router.get("/stats", (req, res) => {
  // TODO: Need to implement search for stats. This is here to stub out the call.
  res.json([]);
});

router.get("/products", (req, res) => {
  // TODO: Need to limit this based on current user
  Article.find((errors, articles) => {
    handleMongooseError("Unable to find articles", errors);

    res.json(articles.map((article) => article.features));
  });
});

router.get("/saved", async (req, res) => {
  // TODO: We need user info so we can filter this by MY saved products
  const savedProducts = await models.SavedProduct.findAll();
  res.json(savedProducts);
});

router.put("/saved/:productId", async (req, res) => {
  const savedProduct = await models.SavedProduct.create({ productId: req.params.productId, createdBy: 1 }); // TODO: Need a real user
  res.json(savedProduct);
});

router.delete("/saved/:productId", async (req, res) => {
  const savedProduct = await models.SavedProduct.findOne({ where: { productId: req.params.productId, createdBy: 1 } }); // TODO: Need a real user

  if (savedProduct) {
    await savedProduct.destroy();
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

router.get('/collections', async (req, res) => {
  // TODO: We need real users so we can filter this by current user
  const collections = await models.Collection.findAll();
  res.json(collections);
});

router.post('/collections', async (req, res) => {
  const savedCollection = await models.Collection.create({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    createdBy: 1 // TODO: We need a real user
  });

  res.json(savedCollection);
});

router.put('/collections/:collectionId', async (req, res) => {
  const existingCollection = await models.Collection.findOne({ where: { id: req.params.collectionId } });

  if (!existingCollection) {
    res.status(404).send();
    return;
  }

  existingCollection.set({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
  });

  const updatedCollection = await existingCollection.save();
  res.json(updatedCollection);
});

router.delete("/collections/:collectionId", async (req, res) => {
  const savedCollection = await models.Collection.findOne({ where: { id: req.params.collectionId } });

  if (savedCollection) {
    await savedCollection.destroy();
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

router.get('/collections/:collectionId/products', async (req, res) => {
  const collection = await models.Collection.findOne({ where: { id: req.params.collectionId }, include: models.SavedProduct });
  if (collection) {
    res.json(collection.SavedProducts);
  } else {
    res.status(404).send();
  }
});

router.put('/collections/:collectionId/products/:savedProductId', async (req, res) => {
  const collection = await models.Collection.findOne({ where: { id: req.params.collectionId } });
  const savedProduct = await models.SavedProduct.findOne({ where: { id: req.params.savedProductId } });

  if (collection && savedProduct) {
    collection.addSavedProduct(savedProduct);
    res.status(201).send();
  } else {
    res.status(404).send();
  }
});

router.delete('/collections/:collectionId/products/:savedProductId', async (req, res) => {
  const collection = await models.Collection.findOne({ where: { id: req.params.collectionId } });
  const savedProduct = await models.SavedProduct.findOne({ where: { id: req.params.savedProductId } });

  if (collection && savedProduct) {
    collection.removeSavedProduct(savedProduct);
    res.status(201).send();
  } else {
    res.status(404).send();
  }
});

module.exports = router;
