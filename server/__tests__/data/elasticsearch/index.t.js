const { ElasticsearchContainer } = require("testcontainers");

describe('Elasticsearch setup', () => {
  let container;

  beforeAll(async () => {
    container = await new ElasticsearchContainer().start();
    process.env.ES_URL = container.getHttpUrl();
    console.log(container.getHttpUrl());
  }, 120_000);

  afterAll(async () => {
    await container.stop();
  });

  it('should setup the client and return it', () => {
    const client = require('../../../src/data/elasticsearch');

    expect(client).toBeDefined();
  });

  it('should setup the client and return the same one if called multiple times', () => {
    const client1 = require('../../../src/data/elasticsearch');
    const client2 = require('../../../src/data/elasticsearch');

    expect(client1).toBe(client2);
  });
});
