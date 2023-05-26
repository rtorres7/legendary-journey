const { Client } = require("@elastic/elasticsearch");
const constant = require("../util/constant.js");

class IndexService {
  constructor(esUrl=constant.esNode) {
    this.client = new Client({ node: esUrl });
    this.index = "products";
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
}

module.exports = IndexService;
