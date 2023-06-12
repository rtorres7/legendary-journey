const express = require("express");
const router = express.Router();
const { models } = require('../data/sequelize');
const Article = require("../models/articles");
const { handleMongooseError } = require("../util/errors");
const {KiwiPage, KiwiSort} = require('@kiwiproject/kiwi-js');

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
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: Need to limit this based on current user
  Article.find()
    .limit(perPage)
    .skip(skip)
    .sort({ datePublished: sortDir.toLowerCase() })
    .exec((errors, articles) => {
      handleMongooseError('Unable to find products', errors);
      Article.count().exec((errors, count) => {
        const resultPage = KiwiPage.of(page, perPage, count, articles.map((article) => article.features))
          .usingOneAsFirstPage()
          .addKiwiSort(KiwiSort.of('datePublished', sortDir));

        res.json(resultPage);
      });
    });
});

router.get("/saved", async (req, res) => {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  // TODO: We need user info so we can filter this by MY saved products
  // TODO: We need to figure out how to return the actual products
  const {count, rows } = await models.SavedProduct.findAndCountAll({
    offset: skip,
    limit: perPage,
    order: [
      ['createdAt', sortDir.toUpperCase()]
    ]
  });

  const resultPage = KiwiPage.of(page, perPage, count, rows)
    .usingOneAsFirstPage()
    .addKiwiSort(KiwiSort.of('createdAt', sortDir));

  res.json(resultPage);
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
