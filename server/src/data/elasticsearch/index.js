const elasticsearch = require("@elastic/elasticsearch");
const { config } = require("../../config/config");

let esClient;

if (esClient === undefined) {
  const esNode = config.elasticsearch.url;

  if (esNode === "SWAGGER") {
    esClient = {};
  } else {
    esClient = new elasticsearch.Client({
      nodes: esNode,
    });

    if (config.mxs.env === "container") {
      esClient.diagnostic.on("request", (err, result) => {
        console.log("ES Request: ", result.meta.request.params.body);
      });
    }
  }
}

module.exports = esClient;
