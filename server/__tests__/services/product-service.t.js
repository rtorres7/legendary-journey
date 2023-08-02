const { GenericContainer } = require("testcontainers");
const mongoose = require("mongoose");
const ProductService = require('../../src/services/product-service');

const { loadArticlesIntoMongo } = require("../__utils__/dataLoader");

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
  let mongoContainer;
  let mongoUrl;
  let service;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer("mongo")
      .withExposedPorts(27017)
      .start();

    mongoUrl = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}/mxms`;

    // Load articles
    await loadArticlesIntoMongo(mongoUrl);
  }, 120_000);

  beforeEach(async () => {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true });
    service = new ProductService();
  });

  afterEach(() => {
    mongoose.connection.close();
  });

  afterAll(() => {
    mongoContainer.stop();
  });

  describe('findAllByDate', () => {
    it('should find the products by date', async () => {
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
  });

  describe('findById', () => {
    it('should find the single product by id', async() => {
      const product = await service.findById("64709619aa530082dd5cc416");
      expect(product.productNumber).toEqual("WIReWIRe_sample_2");
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
      expect(countAfterDelete).toEqual(countWithRecordToDelete - 1);

      const result = await Article.find({ productNumber: 'product-to-delete' });
      expect(result).toHaveLength(0);
    });

    // TODO: Once we figure out the rollback strategy, we need to write a test to validate the rollback
  });

  describe('findFeaturesAndBriefs', () => {
    it('should return featured products and briefs', async () => {
      const results = await service.findFeaturesAndBriefs();

      expect(results.featured).toHaveLength(4);
      expect(results.briefs).toHaveLength(1);
    });
  });

  describe('findPageOfDraftProductsForUser', () => {
    it('should return a page of draft products', async () => {
      const drafts = await service.findPageOfDraftProductsForUser(1, 1, 10, 0, 'desc');

      expect(drafts.content).toHaveLength(1);
      expect(drafts.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_5']);
      expect(drafts.size).toEqual(10);
      expect(drafts.number).toEqual(1);
      expect(drafts.numberOfElements).toEqual(1);
      expect(drafts.totalPages).toEqual(1);
      expect(drafts.totalElements).toEqual(1);
      expect(drafts.sort).toEqual({ direction: 'desc', property: 'createdAt', ignoreCase: false, ascending: false});
    });
  });

  describe('findPageOfRecentProductsForUser', () => {
    it('should return a page of recent products', async () => {
      const drafts = await service.findPageOfRecentProductsForUser(1, 1, 10, 0, 'desc');

      expect(drafts.content).toHaveLength(4);
      expect(drafts.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_4', 'WIReWIRe_sample_3', 'WIReWIRe_sample_2', 'WIReWIRe_sample_1']);
      expect(drafts.size).toEqual(10);
      expect(drafts.number).toEqual(1);
      expect(drafts.numberOfElements).toEqual(4);
      expect(drafts.totalPages).toEqual(1);
      expect(drafts.totalElements).toEqual(4);
      expect(drafts.sort).toEqual({ direction: 'desc', property: 'datePublished', ignoreCase: false, ascending: false});
    });
  });

  describe('findPageOfProductsForUser', () => {
    it('should return a page of all products', async () => {
      const drafts = await service.findPageOfProductsForUser(1, 1, 10, 0, 'desc');

      expect(drafts.content).toHaveLength(5);
      expect(drafts.content.map(product => product.productNumber)).toEqual(['WIReWIRe_sample_1', 'WIReWIRe_sample_2', 'WIReWIRe_sample_3', 'WIReWIRe_sample_4', 'WIReWIRe_sample_5']);
      expect(drafts.size).toEqual(10);
      expect(drafts.number).toEqual(1);
      expect(drafts.numberOfElements).toEqual(5);
      expect(drafts.totalPages).toEqual(1);
      expect(drafts.totalElements).toEqual(5);
      expect(drafts.sort).toEqual({ direction: 'desc', property: 'createdAt', ignoreCase: false, ascending: false});
    });
  });
});
