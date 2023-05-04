const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");

class SearchService {
  constructor() {
    this.client = new Client({ node: constant.es_node });
    this.index = "products";
  }

  async search(term) {
    return await this.client.search({
      index: this.index,
      query: {
        match: { html_body: term },
      },
    });
  }
}

module.exports = SearchService;
