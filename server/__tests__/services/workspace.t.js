const {  loadSavedProducts, loadCollections, loadCollectionProducts, loadSavedProductsForSearch } = require('../__utils__/dataLoader');
const { Client } = require("@elastic/elasticsearch");
const constant = require("../../src/util/constant");
const { PostgresExtension, ElasticSearchExtension } = require("@kiwiproject/kiwi-test-js");

jest.mock('../../src/services/metadata.js', () => {
  return jest.fn().mockImplementation(() => {
    const { metadata } = require("../__utils__/dataLoader");
    return {
      findAllLookups: jest.fn().mockResolvedValue(metadata.criteria)
    };
  });
});

describe('Workspace Service', () => {
  let service;
  let client;

  beforeAll(async () => {
    const esUrl = ElasticSearchExtension.getElasticSearchUrl();
    process.env.ES_URL = esUrl;

    client = new Client({ node: esUrl });

    // Setup index
    await client.indices.create({
      index: 'savedproducts',
      mappings: constant.indices[1].mappings,
    });

    await PostgresExtension.setupNewDatabase("workspace");
    const postgresUri = PostgresExtension.getPostgresUriWithDb("workspace");

    process.env.POSTGRES_CONNECTION_URL = postgresUri;

    // Load Saved Products
    const savedProduct = await loadSavedProducts(postgresUri);
    await loadSavedProductsForSearch(esUrl, savedProduct.id);
    await loadCollections(postgresUri);
    await loadCollectionProducts(postgresUri);
  });

  beforeEach(() => {
    const WorkspaceService = require("../../src/services/workspace");
    service = new WorkspaceService();
  });

  afterAll(() => {
    client.close();
  });

  describe('findPageOfSavedProductsForUser', () => {
    it('should return a page of saved products for user', async () => {
      const products = await service.findPageOfSavedProductsForUser(1, '', 10, 1, 'desc');

      expect(products.content).toHaveLength(1);
      expect(products.content.map(product => product.productId)).toEqual(['WIReWIRe_sample_1']);
      expect(products.size).toEqual(10);
      expect(products.number).toEqual(1);
      expect(products.numberOfElements).toEqual(1);
      expect(products.totalPages).toEqual(1);
      expect(products.totalElements).toEqual(1);
      expect(products.sort).toEqual({ direction: 'desc', property: 'datePublished', ignoreCase: false, ascending: false});
    });
  });

  describe('createSavedProduct', () => {
    it('should create a saved product with the given information', async () => {
      const savedProduct = await service.createSavedProduct('foo', 1);

      expect(savedProduct.id).toBeDefined();
    });
  });

  describe('deleteSavedProduct', () => {
    it('should delete a saved product', async () => {
      const { models } = require('../../src/data/sequelize');
      const savedProduct = await models.SavedProduct.create({ productId: 'to-be-deleted', createdBy: 1} );

      await service.deleteSavedProduct('to-be-deleted', 1);

      const expected = await models.SavedProduct.findOne({ where: { id: savedProduct.id }});
      expect(expected).toBeNull();
    });
  });

  describe('findPageOfCollectionsForUser', () => {
    it('should return a page of collection for user', async () => {
      const collections = await service.findPageOfCollectionsForUser(1, 1, 10, 0, 'desc');

      expect(collections.content).toHaveLength(1);
      expect(collections.content.map(collection => collection.name)).toEqual(['Sample Collection']);
      expect(collections.size).toEqual(10);
      expect(collections.number).toEqual(1);
      expect(collections.numberOfElements).toEqual(1);
      expect(collections.totalPages).toEqual(1);
      expect(collections.totalElements).toEqual(1);
      expect(collections.sort).toEqual({ direction: 'desc', property: 'createdAt', ignoreCase: false, ascending: false});
    });
  });

  describe('createCollection', () => {
    it('should save a new collection', async () => {
      const savedCollection = await service.createCollection({ name: 'foo-collection' });
      expect(savedCollection.id).toBeDefined();
    });
  });

  describe('updateCollection', () => {
    it('should update the given collection', async () => {
      const { models } = require('../../src/data/sequelize');
      const original = await models.Collection.create({ name: 'bar' });

      const updated = await service.updateCollection(original.id, { name: 'baz', description: 'what?'});

      expect(updated.name).toEqual('baz');
      expect(updated.description).toEqual('what?');
    });
  });

  describe('deleteCollection', () => {
    it('should delete the given collection', async () => {
      const { models } = require('../../src/data/sequelize');
      const original = await models.Collection.create({ name: 'bar' });

      await service.deleteCollection(original.id);

      const expected = await models.Collection.findOne({ where: { id: original.id }});
      expect(expected).toBeNull();
    });
  });

  describe('findSavedProductsInCollection', () => {
    it('should return list of saved products associated with given collection', async () => {
      const { models } = require('../../src/data/sequelize');
      const collection = await models.Collection.findOne({ where: {name: 'Sample Collection' }});
      const product = await models.SavedProduct.findOne({ where: {productId: "WIReWIRe_sample_1" }});

      await collection.addSavedProduct(product);

      await client.update({
        index: 'savedproducts',
        refresh: true,
        id: product.id.toString(),
        doc: {
          collection: [collection.id]
        }
      });

      const products = await service.findSavedProductsInCollection(collection.id, '');

      expect(products.content).toHaveLength(1);
      expect(products.content.map(product => product.productId)).toEqual(['WIReWIRe_sample_1']);
      expect(products.size).toEqual(10);
      expect(products.number).toEqual(1);
      expect(products.numberOfElements).toEqual(1);
      expect(products.totalPages).toEqual(1);
      expect(products.totalElements).toEqual(1);
      expect(products.sort).toEqual({ direction: 'desc', property: 'datePublished', ignoreCase: false, ascending: false});
    });
  });

  describe('addSavedProductToCollection', () => {
    it('should add a new saved product to a given collection', async () => {
      const { models } = require('../../src/data/sequelize');
      const collection = await models.Collection.findOne({ where: { name: 'Sample Collection' }});
      const product = await models.SavedProduct.findOne({ where: { productId: "WIReWIRe_sample_1" }});

      const savedCollection = await service.addSavedProductToCollection(collection.id, product.id);

      expect(savedCollection.SavedProducts).toHaveLength(1);
      expect(savedCollection.SavedProducts[0].id).toEqual(product.id);

      const results = await client.search({
        index: 'savedproducts',
        query: {
          bool: {
            must: [
              {
                match: {
                  productId: 'WIReWIRe_sample_1',
                },
              },
              {
                match: {
                  savedProductUserId: 1,
                },
              },
            ],
          },
        },
      });

      expect(results.hits.hits[0]._source.collection).toEqual([collection.id]);
    });

    it('should return null if the collection can not be found', async () => {
      const { models } = require('../../src/data/sequelize');
      const product = await models.SavedProduct.create({ productId: 'wooo' });

      const savedCollection = await service.addSavedProductToCollection(10_000, product.id);

      expect(savedCollection).toBeNull();
    });

    it('should return null if the saved product can not be found', async () => {
      const { models } = require('../../src/data/sequelize');
      const collection = await models.Collection.create({ name: 'bar' });

      const savedCollection = await service.addSavedProductToCollection(collection.id, 10_000);

      expect(savedCollection).toBeNull();
    });
  });

  describe('removeSavedProductFromCollection', () => {
    it('should remove a saved product from a given collection', async () => {
      const { models } = require('../../src/data/sequelize');
      const collection = await models.Collection.findOne({ where: {name: 'Sample Collection' }});
      const product = await models.SavedProduct.findOne({ where: {productId: "WIReWIRe_sample_1" }});

      await collection.addSavedProduct(product);

      await client.update({
        index: 'savedproducts',
        refresh: true,
        id: product.id.toString(),
        doc: {
          collection: [collection.id]
        }
      });

      const preResults = await client.search({
        index: 'savedproducts',
        query: {
          bool: {
            must: [
              {
                match: {
                  productId: 'WIReWIRe_sample_1',
                },
              },
              {
                match: {
                  savedProductUserId: 1,
                },
              },
            ],
          },
        },
      });

      expect(preResults.hits.hits[0]._source.collection).toEqual([collection.id]);

      const savedCollection = await service.removeSavedProductFromCollection(collection.id, product.id);

      expect(savedCollection.SavedProducts).toHaveLength(0);

      const postResults = await client.search({
        index: 'savedproducts',
        query: {
          bool: {
            must: [
              {
                match: {
                  productId: 'WIReWIRe_sample_1',
                },
              },
              {
                match: {
                  savedProductUserId: 1,
                },
              },
            ],
          },
        },
      });

      expect(postResults.hits.hits[0]._source.collection).toEqual([]);
    });

    it('should return null if the collection can not be found', async () => {
      const { models } = require('../../src/data/sequelize');
      const product = await models.SavedProduct.create({ productId: 'wooo' });

      const savedCollection = await service.removeSavedProductFromCollection(10_000, product.id);

      expect(savedCollection).toBeNull();
    });

    it('should return null if the saved product can not be found', async () => {
      const { models } = require('../../src/data/sequelize');
      const collection = await models.Collection.create({ name: 'bar' });

      const savedCollection = await service.removeSavedProductFromCollection(collection.id, 10_000);

      expect(savedCollection).toBeNull();
    });
  });
});
