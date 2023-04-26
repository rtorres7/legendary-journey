const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");

class IndexService {
  constructor() {
    this.client = new Client({ node: constant.es_node });
    this.index = "products";
  }

  async create(product) {
    const { document } = await this.client.index({
      index: this.index,
      id: product.id,
      document: product,
    });
    return document;
  }

  async refresh() {
    const { response } = await client.indices.refresh({
      index: this.index,
    });
    return response;
  }

  async getById(id) {
    const document = await this.client.get({
      index: this.index,
      id: id,
    });
    return document;
  }

  async update(product) {
    const { document } = await this.client.update({
      index: this.index,
      id: product.id,
      body: {
        doc: {
          product,
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
}

module.exports = IndexService;
