const elasticsearch = require("@elastic/elasticsearch");

let esClient;

if (esClient === undefined) {
  const esNode = process.env.ES_URL;

  if (esNode === "SWAGGER") {
    esClient = {};
  } else {
    esClient = new elasticsearch.Client({
      nodes: esNode,
    });

    if (process.env.MXS_ENV === 'container') {
      esClient.diagnostic.on('request', (err, result) => {
        console.log("ES Request: ", result.meta.request.params.body);
      });
    }
  }
}

module.exports = esClient;
