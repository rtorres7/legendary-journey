const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");

class SearchService {
  constructor() {
    this.client = new Client({ node: constant.es_node });
    this.index = "products";
  }

  async search(term, perPage=10, page=1, sortMethod='desc') {
    const skipCount = (page - 1) * perPage;
    const sortClause = this.buildSortClause(sortMethod);

    return await this.client.search({
      index: this.index,
      from: skipCount,
      size: perPage,
      sort: [sortClause],
      query: {
        match: { html_body: term },
      },
      highlight: {
        fields: {
          html_body: {}
        }
      }
    });
  }

  buildSortClause(sortMethod) {
    switch (sortMethod) {
      case 'desc':
        return { date_published: { order: 'desc' }};
      case 'asc':
        return { date_published: { order: 'asc' }};
      default:
        return { '_score': { order: 'desc' }};
    }
  }
}

module.exports = SearchService;
