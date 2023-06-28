const elasticsearch = require("@elastic/elasticsearch");

let esClient;

if (esClient === undefined) {
  const esNode = process.env.ES_URL;

  esClient = new elasticsearch.Client({
    node: esNode,
  });
}

module.exports = esClient;
