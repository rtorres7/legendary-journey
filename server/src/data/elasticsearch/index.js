const elasticsearch = require("@elastic/elasticsearch");

let esClient;

if (esClient === undefined) {
  const esNode = process.env.ES_URL || "http://127.0.0.1:9200";

  if (esNode === "SWAGGER") {
    esClient = {};
  } else {
    esClient = new elasticsearch.Client({
      nodes: [esNode],
    });
  }
}

module.exports = esClient;
