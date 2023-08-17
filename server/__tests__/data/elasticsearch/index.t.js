const { ElasticSearchExtension } = require("@kiwiproject/kiwi-test-js");

describe('Elasticsearch setup', () => {
  beforeAll(async () => {
    process.env.ES_URL = ElasticSearchExtension.getElasticSearchUrl();
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
