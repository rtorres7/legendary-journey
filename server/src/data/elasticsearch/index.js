const elasticsearch = require("@elastic/elasticsearch");
const { response } = require("express");

let esClient;

if (esClient === undefined) {
  const esNode = process.env.ES_URL;

  esClient = new elasticsearch.Client({
    node: esNode,
  });

  esClient.cluster.health({}, (error, response) => {
    if (error) {
      console.warn('Elastic search connection is unhealthy', error.message);
    } else {
      console.log('Elastic search is healthy', response);
    }
  });
}

module.exports = esClient;
