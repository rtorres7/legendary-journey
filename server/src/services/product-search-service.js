const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");
const runSearch = require('../util/search');

const PRODUCT_FIELDS = [
  { field: 'classification', aggregation: 'classification', filters: 'classification', filterType: 'OR' },
  { field: 'countries', aggregation: 'countries', filters: 'countries', filterType: 'AND' },
  { field: 'issues', aggregation: 'issues', filters: 'issues', filterType: 'AND' },
  { field: 'nonStateActors', aggregation: 'non_state_actors', filters: 'nonStateActors', filterType: 'AND'},
  { field: 'producingOffices', aggregation: 'producing_offices', filters: 'producing_offices', filterType: 'OR' },
  { field: 'productType', aggregation: 'product_types', filters: 'product_types', filterType: 'OR' },
  { field: 'regions', aggregation: 'regions', filters: 'regions', filterType: 'AND' },
  { field: 'reportingType', aggregation: 'reporting_types', filters: 'reporting_types', filterType: 'OR' },
  { field: 'subregions', aggregation: 'subregions', filters: 'subregions', filterType: 'AND' },
  { field: 'topics', aggregation: 'topics', filters: 'topics', filterType: 'AND' },
]
class ProductSearchService {
  constructor() {
    this.client = require('../data/elasticsearch');
    this.index = "products";
  }

  async search(term, perPage=10, page=1, sortMethod='desc', filters = {}) {
    return await runSearch.runSearch(term, this.index, perPage, page, sortMethod, filters, PRODUCT_FIELDS);
  }

  async searchOne(productNumber) {
    return await runSearch.runSearchOne(productNumber);
  }

  async relatedSearch(id) {
    return await runSearch.runRelatedSearch(id);
  }

  async create(product) {
    await this.client.index({
      index: this.index,
      id: product.id,
      document: product,
    });
  }

  async update(product) {
    const { document } = await this.client.update({
      index: this.index,
      id: product.id,
      body: {
        doc: {
          ...product,
        },
      },
    });

    return document;
  }

  async delete(id) {
    await this.client.delete({
      index: this.index,
      id,
    });
  }
  async createIndexesIfNecessary() {
    const indexesCreated = [];

    for (const indexConfig of constant.indices) {
      if (await this.client.indices.exists({ index: indexConfig.index})) {
        continue;
      }

      console.log(`Elastic search index ${indexConfig.index} does not exist. Creating now.`);
      await this.client.indices.create({
        index: indexConfig.index,
        mappings: indexConfig.mappings,
      });

      indexesCreated.push(indexConfig.index);
    }

    return indexesCreated;
  }
}

module.exports = ProductSearchService;
