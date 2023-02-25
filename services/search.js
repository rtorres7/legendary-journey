const { Client } = require("@elastic/elasticsearch");
const constant = require("./util/constant");

class SearchService {
  constructor() {
    this.client = new Client({ node: constant.es_node });
    this.index = "products";
  }

  async search(term) {
    const result = await client.search({
      index: this.index,
      query: {
        match: { html_body: term },
      },
    });
    console.log(result.hits.hits);
    return result;
  }
}

module.exports = SearchService;
