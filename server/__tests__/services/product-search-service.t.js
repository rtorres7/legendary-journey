const { ElasticsearchContainer } = require("testcontainers");
const { Client } = require("@elastic/elasticsearch");
const ProductSearchService = require("../../src/services/product-search-service");
const constant = require("../../src/util/constant");
const { loadElasticSearch } = require("../__utils__/dataLoader");

jest.mock('../../src/services/metadata.js', () => {
  return jest.fn().mockImplementation(() => {
    const { metadata } = require("../__utils__/dataLoader");
    return {
      findAllLookups: jest.fn().mockResolvedValue(metadata.criteria)
    };
  });
});

describe('ProductSearchService', () => {
  let service;
  let container;
  let client;

  beforeAll(async () => {
    container = await new ElasticsearchContainer().start();
    process.env.ES_URL = container.getHttpUrl();

    client = new Client({ node: container.getHttpUrl() });

    // Setup index
    await client.indices.create({
      index: 'products',
      mappings: constant.indices[0].mappings,
    });

    // Load data
    await loadElasticSearch(container.getHttpUrl());
  }, 70_000);

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(() => {
    service = new ProductSearchService(container.getHttpUrl());
  });

  describe('search', () => {
    it('should have default paging values', async () => {
      const result = await service.search('');
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);
    });

    it('should have respect provided paging values', async () => {
      const result = await service.search('', 1);
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(5);
    });

    it('should allow sorting by datePublished ascending', async () => {
      const result = await service.search('', 10, 1, 'asc');
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_1", "WIReWIRe_sample_2", "WIReWIRe_sample_3", "WIReWIRe_sample_4", "WIReWIRe_sample_5"]);
    });

    it('should allow sorting by datePublished desc', async () => {
      const result = await service.search('', 10, 1, 'desc');
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_5", "WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow sorting by _score desc', async () => {
      const result = await service.search('', 10, 1, 'score');
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_1", "WIReWIRe_sample_2", "WIReWIRe_sample_3", "WIReWIRe_sample_4", "WIReWIRe_sample_5"]);
    });

    it('should default sorting to desc', async () => {
      const result = await service.search('');
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_5", "WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow a term query on htmlBody', async () => {
      const result = await service.search('flu');
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on datePublished', async () => {
      const result = await service.search('', 10, 1, 'desc', { start_date: '2022-09-02', end_date: '2022-09-03' });
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3"]);
    });

    it('should allow filtering on countries with single country', async () => {
      const result = await service.search('', 10, 1, 'desc', { countries: ['AFG'] });
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on countries with multiple countries using AND', async () => {
      const result = await service.search('', 10, 1, 'desc', { countries: ['AFG', 'CHE'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on regions with single region', async () => {
      const result = await service.search('', 10, 1, 'desc', { regions: ['AS'] });
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on regions with multiple regions using AND', async () => {
      const result = await service.search('', 10, 1, 'desc', { regions: ['AS', 'EU'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on subregions with single subregion', async () => {
      const result = await service.search('', 10, 1, 'desc', { subregions: ['ASso'] });
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on subregions with multiple subregions using AND', async () => {
      const result = await service.search('', 10, 1, 'desc', { subregions: ['ASso', 'EUce'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on topics with single topic', async () => {
      const result = await service.search('', 10, 1, 'desc', { topics: ['TERR'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on topics with multiple topics using AND', async () => {
      const result = await service.search('', 10, 1, 'desc', { topics: ['BRL', 'TERR'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on issues with single issue', async () => {
      const result = await service.search('', 10, 1, 'desc', { issues: ['THS'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on issues with multiple issues using AND', async () => {
      const result = await service.search('', 10, 1, 'desc', { issues: ['EEG', 'THS'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on classification with single classification', async () => {
      const result = await service.search('', 10, 1, 'desc', { classification: ['S'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on classification with multiple classifications using OR', async () => {
      const result = await service.search('', 10, 1, 'desc', { classification: ['UNC', 'S'] });
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_5", "WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on productType with single productType', async () => {
      const result = await service.search('', 10, 1, 'desc', { product_types: [10378] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });

    it('should allow filtering on productType with multiple productType using OR', async () => {
      const result = await service.search('', 10, 1, 'desc', { product_types: [10376, 10378] });
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_5", "WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on reportingType with single reportingType', async () => {
      const result = await service.search('', 10, 1, 'desc', { reporting_types: ['analysis.all_source'] });
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_5", "WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on reportingType with multiple reportingType using OR', async () => {
      const result = await service.search('', 10, 1, 'desc', { reporting_types: ['reporting.enterprise', 'analysis.all_source'] });
      expect(result.results).toHaveLength(5);
      expect(result.totalCount).toEqual(5);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_5", "WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on producingOffices with single producingOffices', async () => {
      const result = await service.search('', 10, 1, 'desc', { producing_offices: ['ANCESTRY'] });
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_3", "WIReWIRe_sample_2"]);
    });

    it('should allow filtering on producingOffices with multiple producingOffices using OR', async () => {
      const result = await service.search('', 10, 1, 'desc', { producing_offices: ['ANCESTRY', 'EDUCATION'] });
      expect(result.results).toHaveLength(3);
      expect(result.totalCount).toEqual(3);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on non state actors with single actor', async ()=> {
      const result = await service.search('', 10, 1, 'desc', { nonStateActors: ['EU'] });
      expect(result.results).toHaveLength(2);
      expect(result.totalCount).toEqual(2);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on non state actor with multiple actors using AND', async ()=> {
      const result = await service.search('', 10, 1, 'desc', { nonStateActors: ['EU', 'NATO'] });
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(1);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_2"]);
    });
  });

  describe('create', () => {
    it('should index the given product', async () => {
      const product = {
        id: 'SampleInsert-1',
        htmlBody: 'This is a test'
      };

      await service.create(product);

      expect((await client.get({ index: "products", id: product.id }))._source).toStrictEqual(product);
    });
  });

  describe('update', () => {
    it('should update the given product in the index', async () => {
      const product = {
        id: 'SampleInsert-1',
        htmlBody: 'This is a test'
      };

      await service.create(product);

      expect((await client.get({ index: "products", id: product.id }))._source).toStrictEqual(product);

      const updatedProduct = {
        id: 'SampleInsert-1',
        htmlBody: 'This should be updated'
      };

      await service.update(updatedProduct);

      expect((await client.get({ index: "products", id: product.id }))._source).toStrictEqual(updatedProduct);
    });
  });

  describe('delete', () => {
    it('should delete the given product from the index', async () => {
      const product = {
        id: 'SampleInsert-1',
        htmlBody: 'This is a test'
      };

      await service.create(product);

      expect((await client.get({ index: "products", id: product.id }))._source).toStrictEqual(product);

      await service.delete('SampleInsert-1');

      expect((await client.exists({ index: "products", id: product.id }))).toBeFalsy();
    });
  });
});
