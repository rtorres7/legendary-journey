const { ElasticsearchContainer } = require("testcontainers");
const { Client } = require("@elastic/elasticsearch");
const ProductSearchService = require("../../src/services/product-search-service");
const constant = require("../../src/util/constant");
const { loadElasticSearch } = require("../__utils__/dataLoader");
const { logger } = require("../../src/config/logger");
const fs = require('fs');
const path = require('path');

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
    container = await new ElasticsearchContainer("elasticsearch:8.6.1")
      .withEnvironment({ "xpack.security.enabled": "false" })
      .start();
    process.env.ES_URL = container.getHttpUrl();
    logger.info(`ProductSearchService.beforeAll:  ${container.getHttpUrl()}`);

    client = new Client({ node: container.getHttpUrl() });

    // Setup index
    await client.indices.create({
      index: 'products',
      mappings: constant.indices[0].mappings,
    });

    await client.ingest.putPipeline({
      id: 'mxms-attachment-pipeline',
      body: {
        processors: [{
          attachment: {
            field: "pdfVersionRaw",
            target_field: "pdfVersion",
            remove_binary: true,
          }
        }],
      },
    });

    // Load data
    await loadElasticSearch(container.getHttpUrl());
  }, 70_000);

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(() => {
    service = new ProductSearchService();
  });

  describe('search', () => {
    it('should have default paging values', async () => {
      const result = await service.search('');
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);
    });

    it('should respect provided paging values', async () => {
      const result = await service.search('', 1);
      expect(result.results).toHaveLength(1);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(4);
    });

    it('should allow sorting by datePublished ascending', async () => {
      const result = await service.search('', 10, 1, 'asc');
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_1", "WIReWIRe_sample_2", "WIReWIRe_sample_3", "WIReWIRe_sample_4"]);
    });

    it('should allow sorting by datePublished desc', async () => {
      const result = await service.search('', 10, 1, 'desc');
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow sorting by _score desc', async () => {
      const result = await service.search('', 10, 1, 'score');
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_1", "WIReWIRe_sample_2", "WIReWIRe_sample_3", "WIReWIRe_sample_4"]);
    });

    it('should default sorting to desc', async () => {
      const result = await service.search('');
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
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
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
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
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on reportingType with single reportingType', async () => {
      const result = await service.search('', 10, 1, 'desc', { reporting_types: ['analysis.all_source'] });
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
    });

    it('should allow filtering on reportingType with multiple reportingType using OR', async () => {
      const result = await service.search('', 10, 1, 'desc', { reporting_types: ['reporting.enterprise', 'analysis.all_source'] });
      expect(result.results).toHaveLength(4);
      expect(result.totalCount).toEqual(4);
      expect(result.pages).toEqual(1);

      const ids = result.results.map((hit) => hit.productNumber);
      expect(ids).toStrictEqual(["WIReWIRe_sample_4", "WIReWIRe_sample_3", "WIReWIRe_sample_2", "WIReWIRe_sample_1"]);
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

  describe('relatedSearch', () => {

    it('should return related documents', async ()=> {
      const result = await service.relatedSearch('WIReWIRe_sample_1');
      expect(result.relatedDocuments.length).toBeGreaterThan(1);
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

  describe('indexAttachment', () => {
    it('should index given attachment', async () => {
      const attachment = fs.readFileSync(path.resolve(__dirname, "../__utils__/pdfToIndex.pdf"));
      const attachmentString = attachment.toString("base64");

      await service.indexAttachment("64709619aa530082dd5cc40e", "12345", attachmentString);

      const esRecord = await client.get({index: "products", id: "64709619aa530082dd5cc40e" });

      expect(esRecord._source.pdfVersion.content).toEqual("test");
    });
  });

  describe('removeIndexedAttachment', () => {
    it('should remove an indexed attachment', async () => {
      const attachment = fs.readFileSync(path.resolve(__dirname, "../__utils__/pdfToIndex.pdf"));
      const attachmentString = attachment.toString("base64");

      await service.indexAttachment("64709619aa530082dd5cc416", "12345", attachmentString);

      const esRecord = await client.get({index: "products", id: "64709619aa530082dd5cc416" });
      expect(esRecord._source.pdfVersion.content).toEqual("test");

      await service.removeIndexedAttachment("64709619aa530082dd5cc416", "12345");

      const esRecord2 = await client.get({index: "products", id: "64709619aa530082dd5cc416" });
      expect(esRecord2._source.pdfVersion).toBeNull();
    });
  });
});
