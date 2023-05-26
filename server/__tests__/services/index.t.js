const { ElasticsearchContainer } = require("testcontainers");
const { Client } = require("@elastic/elasticsearch");
const constant = require("../../src/util/constant");
const IndexService = require("../../src/services");
describe('IndexService', () => {
  let service;
  let container;
  let client;

  beforeAll(async () => {
    container = await new ElasticsearchContainer().start();
    client = new Client({ node: container.getHttpUrl() });

    // Setup index
    await client.indices.create({
      index: 'products',
      mappings: constant.indices[0].mappings,
    });
  }, 70_000);

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(() => {
    service = new IndexService(container.getHttpUrl());
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
