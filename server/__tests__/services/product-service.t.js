const { MongoExtension } = require("@kiwiproject/kiwi-test-js");
const _ = require("lodash");
const mongoose = require("mongoose");
const MetadataService = require("../../src/services/metadata");
const ProductService = require('../../src/services/product-service');

const { loadMetadata, loadArticlesIntoMongo } = require("../__utils__/dataLoader");

const { v4: uuidv4 } = require("uuid");
const utc = require("dayjs/plugin/utc");
const dayjs = require("dayjs");
dayjs.extend(utc);

const Article = require("../../src/models/articles");

jest.mock('../../src/services/product-search-service.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      create: jest.fn().mockImplementation((product) => {
        if (product.summary === 'Error test') {
          throw new Error('oops');
        }
      }),
      update: jest.fn().mockImplementation((product) => {
        if (product.summary === 'Error test') {
          throw new Error('oops');
        }
      }),
      search: jest.fn()
        .mockResolvedValueOnce({ hits: { hits: [{ _source: { id: 1 }}] }}),
      delete: jest.fn(),
    };
  });
});

describe('ProductService', () => {
  let mongoUrl;
  let service;
  let metadataService;

  beforeAll(async () => {
    mongoUrl = MongoExtension.getMongoUriWithDb("products");

    // Load articles
    await loadMetadata(mongoUrl);
    await loadArticlesIntoMongo(mongoUrl);
  });

  beforeEach(async () => {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    service = new ProductService();
    metadataService = new MetadataService();
  });

  afterEach(() => {
    mongoose.connection.close();
  });

  afterAll(async () => {
    await MongoExtension.dropDatabase("products");
  });

  describe('findAllByDate', () => {
    it('should find the products by date', async () => {
      const products = await service.findAllByDate('2022-09-01');

      expect(products).toHaveLength(1);
      expect(products[0].productNumber).toEqual("WIReWIRe_sample_2");
    });

    it('should not return deleted products', async () => {
      await Article.create({ productNumber: "product-to-delete", deleted: true, datePublished: '2022-09-01' });

      const products = await service.findAllByDate('2022-09-01');

      expect(products).toHaveLength(1);
      expect(products[0].productNumber).toEqual("WIReWIRe_sample_2");
    });
  });

  describe('findByProductNumber', () => {
    it('should find the single product by product number', async() => {
      const product = await service.findByProductNumber("WIReWIRe_sample_1");
      expect(product.productNumber).toEqual("WIReWIRe_sample_1");
    });

    it('should return null if the requested product is mark deleted', async () => {
      await Article.create({ productNumber: "product-to-delete", deleted: true });
      const product = await service.findByProductNumber("product-to-delete");
      expect(product).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find the single product by id', async() => {
      const product = await service.findById("64709619aa530082dd5cc416");
      expect(product.productNumber).toEqual("WIReWIRe_sample_2");
    });

    it('should return null if the requested product is mark deleted', async () => {
      const savedProduct = await Article.create({ deleted: true });
      const product = await service.findById(savedProduct.id);
      expect(product).toBeNull();
    });
  });

  describe('createProduct', () => {
    afterEach(async () => {
      await Article.deleteMany({ summary: 'My test' });
      await Article.deleteMany({ summary: 'Error test' });
    });

    it('should save the new product and index it in elastic search', async () => {
      const product = new Article({
        createdAt: dayjs().toDate(),
        datePublished: dayjs().format(),
        htmlBody: 'Creation test',
        issues: [
          {
            name: "Terrorism and Homeland Security",
            code: "THS",
            topics: [
              {
                name: "Terrorism",
                codes: ["TERR"],
              },
            ],
          },
        ],
        needed: {},
        orgRestricted: false,
        productNumber: uuidv4(),
        producingOffices: [],
        productType: {
          name: "Current",
          code: 10376,
          publishable: true,
        },
        publicationNumber: '',
        reportingType: {
          name: "Analysis: All Source",
          code: "analysis.all_source",
          productTypes: [
            1000, 1001, 10376, 10377, 10378, 10379, 10380, 10381, 10382,
            10383, 10384, 10385,
          ],
        },
        summary: 'My test',
        title: 'My test',
        topics: [],
        nonStateActors: [],
        updatedAt: dayjs().toDate()
      });

      const savedProduct = await service.createProduct(product);
      expect(savedProduct.id).toBeDefined();

      // TODO: need to verify the create method was called on ProductSearchService
    });

    it('should delete the saved product if the indexing fails', async () => {
      const product = new Article({
        createdAt: dayjs().toDate(),
        datePublished: dayjs().format(),
        htmlBody: 'Creation test',
        issues: [
          {
            name: "Terrorism and Homeland Security",
            code: "THS",
            topics: [
              {
                name: "Terrorism",
                codes: ["TERR"],
              },
            ],
          },
        ],
        needed: {},
        orgRestricted: false,
        productNumber: uuidv4(),
        producingOffices: [],
        productType: {
          name: "Current",
          code: 10376,
          publishable: true,
        },
        publicationNumber: '',
        summary: 'Error test',
        title: 'My test',
        topics: [],
        nonStateActors: [],
        updatedAt: dayjs().toDate()
      });

      await expect(async () => {
        await service.createProduct(product);
      }).rejects
        .toThrow('There was a problem indexing product, rolling back database save');

      const result = await Article.find({ summary: 'Error test' });
      expect(result).toHaveLength(0);
    });
  });

  describe('updateProduct', () => {
    afterEach(async () => {
      await Article.deleteMany({ productNumber: 'foo' });
      await Article.deleteMany({ productNumber: 'bar' });
    });

    it('should save the update the product and update the index in elastic search', async () => {
      const original = await Article.create({ productNumber: "foo" });

      const update = new Article({
        _id: original.id,
        productNumber: "foo",
        summary: 'Updated'
      });

      const updatedProduct = await service.updateProduct(original.id, update);

      expect(updatedProduct.id).toEqual(original.id);
      expect(updatedProduct.summary).toEqual("Updated");
    });

    it('should rollback the update of the saved product if the indexing update fails', async () => {
      const original = await Article.create({ productNumber: "bar" });

      const update = new Article({
        _id: original.id,
        productNumber: "bar",
        summary: 'Error test'
      });

      await expect(async () => {
        await service.updateProduct(original.id, update);
      }).rejects
        .toThrow('There was a problem updating product in index');

      const result = await Article.find({ productNumber: 'bar' });
      expect(result.summary).toBeUndefined();
    });
  });

  describe('deleteProduct', () => {
    it('should remove the product from the database and the index', async () => {
      const original = await Article.create({ productNumber: "product-to-delete" });

      const countWithRecordToDelete = await Article.count();
      await service.deleteProduct(original.id);

      const countAfterDelete = await Article.count();
      expect(countAfterDelete).toEqual(countWithRecordToDelete);

      const result = await Article.find({ productNumber: 'product-to-delete' });
      expect(result[0].deleted).toEqual(true);
    });

    // TODO: Once we figure out the rollback strategy, we need to write a test to validate the rollback
  });
  
  describe('findFeaturesAndBriefs', () => {
    afterEach(async () => {
      await Article.deleteMany({ summary: 'My test' });
      await Article.deleteMany({ summary: 'Error test' });
    });

    const mapDiss = (obj) => ({ name: obj.name, code: obj.code });
    const createPublished = async (productTypeCode) => {
      /*
      10391 - Alert
      10389 - Bulletin
      10376 - Current
      10377 - Daily Brief
      10378 - Community Product
      10379 - CT Digest
      10380 - CT Weekly
      10381 - Foreign Product
      10382 - Special Threat Matrix
      10383 - SVTC Notes
      10384 - Terrorism Digest
      10385 - Terrorism Summary
      10386 - Threat Matrix
      10392 - Threat of Key Concern
      10390 - Watch
      */
      const countries =  mapDiss(await metadataService.findCountriesFor(["AFG"]));
      const issues =  mapDiss(await metadataService.findIssuesForTopics(["THS"]));
      const nonStateActors =  mapDiss(await metadataService.findNonStateActorsFor(["EU"]));
      const producingOffices =  mapDiss(await metadataService.findProducingOfficesFor(["DNI"]));
      const productType =  mapDiss(await metadataService.findProductType(productTypeCode));
      const topics =  mapDiss(await metadataService.findTopicsFor(["TERR"]));
      const article = new Article({
        classification: "UNC",
        classificationXml: "<?xml version='1.0'?>UNCLASSIFIED<class:Classification>",
        countries,
        createdAt: dayjs().toDate(),
        datePublished: dayjs().format(),
        htmlBody: 'Creation test',
        issues,
        nonStateActors,
        orgRestricted: false,
        pocInfo:  "National Counterterrorism Center (NCTC) Operations Center",
        producingOffices,
        productNumber: uuidv4(),
        productType,
        publicationNumber: dayjs().unix(),
        state: "posted",
        summary: 'My test',
        summaryClassification: "U",
        summaryClassificationXml: "<?xml version='1.0'?>UNCLASSIFIED<class:Classification>",
        title: 'My test',
        titleClassification: "U",
        titleClassificationXml: "<?xml version='1.0'?>UNCLASSIFIED<class:Classification>",
        topics,
        updatedAt: dayjs().toDate(),
      });
      const savedProduct = await service.createProduct(article);
      return savedProduct;
    };

    it('should return featured products and briefs', async () => {
      const results = await service.findFeaturesAndBriefs();
      expect(results.featured).toHaveLength(3);
      expect(results.briefs).toHaveLength(0);
    });

    it('should not return deleted products', async () => {
      await Article.create({ productNumber: "product-to-delete", state: "posted", deleted: true, datePublished: '2023-08-01', productType: { code: 10377 } });
      const results = await service.findFeaturesAndBriefs();
      expect(results.featured).toHaveLength(3);
      expect(results.briefs).toHaveLength(0);
      expect(results.featured.map(p => p.productNumber)).not.toContain("product-to-delete");
      expect(results.briefs.map(p => p.productNumber)).not.toContain("product-to-delete");
    });

    it('should not return in features or briefs', async () => {
      await createPublished(10391); // Alert
      await createPublished(10389); // Bulletin
      await createPublished(10378); // Community Product
      await createPublished(10381); // Foreign Product
      await createPublished(10392); // Threat of Key Concern
      await createPublished(10390); // Watch
      await createPublished(10376); // Current (Feature)
      const results = await service.findFeaturesAndBriefs();
      expect(results.featured).toHaveLength(8); // 3 existing + 1 new current, plus 4 warning products
      expect(results.briefs).toHaveLength(0);
    });

    it('should return in briefs but not in featured', async () => {
      const briefs = [];
      briefs.push(await createPublished(10377)); // Daily Brief
      briefs.push(await createPublished(10379)); // CT Digest
      briefs.push(await createPublished(10380)); // CT Weekly
      briefs.push(await createPublished(10384)); // Terrorism Digest
      briefs.push(await createPublished(10385)); // Terrorism Summary
      briefs.push(await createPublished(10386)); // Threat Matrix
      while (briefs.length > 0) {
        const results = await service.findFeaturesAndBriefs();
        expect(results.featured).toHaveLength(3); // no new featured
        expect(results.briefs).toHaveLength(Math.min(briefs.length, 3)); // results limited to max 3
        // delete results
        for (const result of results.briefs) {
          expect(briefs.findIndex(i => i.productNumber === result.productNumber) >= 0);
          _.remove(briefs, i => i.productNumber === result.productNumber);
          await service.deleteProduct(result.id);
        }
      }
    });
  });

  describe('findPageOfDraftProductsForUser', () => {
    it('should return a page of draft products', async () => {
      const drafts = await service.findPageOfDraftProductsForUser(1, 1, 10, 0, 'desc');
      verifyDrafts(drafts);
    });

    it('should not return deleted products', async () => {
      await Article.create({ productNumber: "product-to-delete", state: "draft", createdBy: { id: 1 }, deleted: true });

      const drafts = await service.findPageOfDraftProductsForUser(1, 1, 10, 0, 'desc');
      verifyDrafts(drafts);

      expect(drafts.content.map(p => p.productNumber)).not.toContain("product-to-delete");
    });

    function verifyDrafts(drafts) {
      expect(drafts.content).toHaveLength(1);
      expect(drafts.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_5']);
      expect(drafts.size).toEqual(10);
      expect(drafts.number).toEqual(1);
      expect(drafts.numberOfElements).toEqual(1);
      expect(drafts.totalPages).toEqual(1);
      expect(drafts.totalElements).toEqual(1);
      expect(drafts.sort).toEqual({ direction: 'desc', property: 'createdAt', ignoreCase: false, ascending: false});
    }
  });

  describe('findPageOfRecentProductsForUser', () => {
    it('should return a page of recent products', async () => {
      const recentProducts = await service.findPageOfRecentProductsForUser(1, 1, 10, 0, 'desc');
      verifyRecentProducts(recentProducts);
    });

    it('should not return deleted products', async () => {
      await Article.create({ productNumber: "product-to-delete", state: "posted", createdBy: { id: 1 }, deleted: true });

      const recentProducts = await service.findPageOfRecentProductsForUser(1, 1, 10, 0, 'desc');
      verifyRecentProducts(recentProducts);

      expect(recentProducts.content.map(p => p.productNumber)).not.toContain("product-to-delete");
    });

    function verifyRecentProducts(recentProducts) {
      expect(recentProducts.content).toHaveLength(4);
      expect(recentProducts.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_4', 'WIReWIRe_sample_3', 'WIReWIRe_sample_2', 'WIReWIRe_sample_1']);
      expect(recentProducts.size).toEqual(10);
      expect(recentProducts.number).toEqual(1);
      expect(recentProducts.numberOfElements).toEqual(4);
      expect(recentProducts.totalPages).toEqual(1);
      expect(recentProducts.totalElements).toEqual(4);
      expect(recentProducts.sort).toEqual({ direction: 'desc', property: 'datePublished', ignoreCase: false, ascending: false});
    }
  });

  describe('findPageOfRecentProductsForProducingOffice', () => {
    it('should return a page of recent products', async () => {
      const results = await service.findPageOfRecentProductsForProducingOffice('AGRICULTURE', 1, 10, 0, 'desc');
      verifyRecentProducts(results);
    });

    it('should not return deleted products', async () => {
      await Article.create({ productNumber: "product-to-delete", state: "posted", producingOffices: [{ name:'AGRICULTURE' }], deleted: true });

      const recentProducts = await service.findPageOfRecentProductsForProducingOffice("AGRICULTURE", 1, 10, 0, 'desc');
      verifyRecentProducts(recentProducts);

      expect(recentProducts.content.map(p => p.productNumber)).not.toContain("product-to-delete");
    });

    function verifyRecentProducts(results) {
      expect(results.content).toHaveLength(1);
      expect(results.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_4']);
      expect(results.size).toEqual(10);
      expect(results.number).toEqual(1);
      expect(results.numberOfElements).toEqual(1);
      expect(results.totalPages).toEqual(1);
      expect(results.totalElements).toEqual(1);
      expect(results.sort).toEqual({ direction: 'desc', property: 'datePublished', ignoreCase: false, ascending: false});
    }
  });

  describe('findPageOfProductsForUser', () => {
    it('should return a page of all products', async () => {
      const products = await service.findPageOfProductsForUser(1, 1, 10, 0, 'desc');
      verifyProductsForUser(products);
    });

    it('should not return deleted products', async () => {
      await Article.create({ productNumber: "product-to-delete", createdBy: { id: 1 }, deleted: true });

      const products = await service.findPageOfProductsForUser(1, 1, 10, 0, 'desc');
      verifyProductsForUser(products);

      expect(products.content.map(p => p.productNumber)).not.toContain("product-to-delete");
    });

    function verifyProductsForUser(products) {
      expect(products.content).toHaveLength(5);
      expect(products.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_1', 'WIReWIRe_sample_2', 'WIReWIRe_sample_3', 'WIReWIRe_sample_4', 'WIReWIRe_sample_5']);
      expect(products.size).toEqual(10);
      expect(products.number).toEqual(1);
      expect(products.numberOfElements).toEqual(5);
      expect(products.totalPages).toEqual(1);
      expect(products.totalElements).toEqual(5);
      expect(products.sort).toEqual({ direction: 'desc', property: 'createdAt', ignoreCase: false, ascending: false});
    }
  });
});
