const elasticsearch = require("@elastic/elasticsearch");

let esClient;

if (esClient === undefined) {
  const esNode = process.env.ES_URL;

  if (esNode === 'SWAGGER') {
    esClient = {}
  } else {
    esClient = new elasticsearch.Client({
      nodes: esNode,
    });
  }
}

module.exports = esClient;
