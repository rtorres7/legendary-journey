const ProductService = require('./product-service');
const { models } = require('../data/sequelize');
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");
const runSearch = require('../util/search');
// const UniqueView = models.UniqueView;
// const TotalView = models.TotalView;

const PRODUCT_FIELDS = [
  { field: 'classification', aggregation: 'classification', filters: 'classification', filterType: 'OR' },
  { field: 'countries', aggregation: 'countries', filters: 'countries', filterType: 'AND' },
  { field: 'issues', aggregation: 'issues', filters: 'issues', filterType: 'AND' },
  { field: 'nonStateActors', aggregation: 'non_state_actors', filters: 'nonStateActors', filterType: 'AND'},
  { field: 'producingOffices', aggregation: 'producing_offices', filters: 'producing_offices', filterType: 'OR' },
  { field: 'productType', aggregation: 'product_types', filters: 'product_types', filterType: 'OR' },
  { field: 'regions', aggregation: 'regions', filters: 'regions', filterType: 'AND' },
  { field: 'reportingType', aggregation: 'reporting_types', filters: 'reporting_types', filterType: 'OR' },
  { field: 'savedProductUserId' },
  { field: 'subregions', aggregation: 'subregions', filters: 'subregions', filterType: 'AND' },
  { field: 'topics', aggregation: 'topics', filters: 'topics', filterType: 'AND' },
];

class WorkspaceService {
  constructor() {
    this.client = require("../data/elasticsearch");
    this.index = "savedproducts";
    this.productService = new ProductService();
  }

  async getUserProductViews(userId) {
    const totalViews = await this._getTotalViews(userId);
    const uniqueViews = await this._getUniqueViews(userId);
    return { totalViews, uniqueViews };
  }

  async _getTotalViews(productId) {
    const totalViewEntry = await models.TotalView.findOne({
      where: {
        productId: productId
      },
      attributes: ['totalViewCount']
    });

    if (totalViewEntry) {
      return totalViewEntry.totalViewCount;
    } else {
      return 0;
    }
  }

  async _getUniqueViews(productId) {
    const uniqueUserCount = await models.UniqueView.count({
      where: {
        productId: productId
      },
      distinct: true,
      col: 'viewedBy'
    });
    return uniqueUserCount;
  }

  async findPageOfSavedProductsForUser(
    userId,
    term,
    perPage = 10,
    page = 1,
    sortDir = "desc",
    filters = {},
  ) {
    const filtersWithUser = {
      ...filters,
      savedProductUserId: userId,
    };

    const results = await runSearch.runSearch(
      term,
      this.index,
      perPage,
      page,
      sortDir,
      filtersWithUser,
      PRODUCT_FIELDS,
    );

    return KiwiPage.of(page, perPage, results.totalCount, results.results)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("datePublished", sortDir))
      .addSupplementaryData({ aggregations: results.aggregations });
  }

  async createSavedProduct(productId, userId) {
    const savedProduct = await models.SavedProduct.create({
      productId: productId,
      createdBy: userId,
    });

    try {
      const product = await this.productService.findById(productId);
      const savedProductToIndex = {
        ...product.indexable,
        savedProductUserId: userId,
        productId,
        id: savedProduct.id
      };

      await this.client.index({
        index: this.index,
        document: savedProductToIndex,
      });
    } catch (error) {
      console.log("There was a problem indexing saved product");
    }

    return savedProduct;
  }

  async deleteSavedProduct(productId, userId) {
    await models.SavedProduct.destroy({
      where: {
        productId: productId,
        createdBy: userId,
      },
    });

    await this.client.deleteByQuery({
      index: this.index,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  productId: productId,
                },
              },
              {
                match: {
                  savedProductUserId: userId,
                },
              },
            ],
          },
        },
      },
    });
  }

  async findPageOfCollectionsForUser(userId, page, limit, offset, sortDir) {
    const { count, rows } = await models.Collection.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["createdAt", sortDir.toUpperCase()]],
    });

    return KiwiPage.of(page, limit, count, rows)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("createdAt", sortDir));
  }

  async createCollection(collectionData) {
    return await models.Collection.create(collectionData);
  }

  async updateCollection(id, collectionData) {
    const result = await models.Collection.update(collectionData, {
      where: {
        id: id,
      },
      returning: true,
    });

    return result[1][0];
  }

  async deleteCollection(id) {
    await models.Collection.destroy({
      where: {
        id: id,
      },
    });
  }

  async findSavedProductsInCollection(collectionId, term, perPage = 10, page = 1, sortDir = "desc", filters = {}) {
    const filtersWithUser = {
      ...filters,
      collection: collectionId
    };

    const results = await runSearch.runSearch(
      term,
      this.index,
      perPage,
      page,
      sortDir,
      filtersWithUser,
      PRODUCT_FIELDS
    );

    return KiwiPage.of(page, perPage, results.totalCount, results.results)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("datePublished", sortDir))
      .addSupplementaryData({ aggregations: results.aggregations });
  }

  async addSavedProductToCollection(collectionId, savedProductId) {
    const collection = await models.Collection.findOne({
      where: { id: collectionId },
    });
    const savedProduct = await models.SavedProduct.findOne({
      where: { id: savedProductId },
    });

    if (collection && savedProduct) {
      await collection.addSavedProduct(savedProduct);

      const reloadedSavedProduct = await savedProduct.reload({
        include: models.Collection,
      });

      await this.updateCollectionsInIndex(reloadedSavedProduct);

      return await collection.reload({ include: models.SavedProduct });
    }

    return null;
  }

  async updateCollectionsInIndex(savedProduct) {
    await this.client.update({
      index: this.index,
      refresh: true,
      id: savedProduct.id.toString(),
      doc: {
        collection: savedProduct.Collections.map((collection) => collection.id)
      }
    });
  }

  async removeSavedProductFromCollection(collectionId, savedProductId) {
    const collection = await models.Collection.findOne({
      where: { id: collectionId },
    });
    const savedProduct = await models.SavedProduct.findOne({
      where: { id: savedProductId },
    });

    if (collection && savedProduct) {
      await collection.removeSavedProduct(savedProduct);
      const reloadedSavedProduct = await savedProduct.reload({
        include: models.Collection,
      });
      await this.updateCollectionsInIndex(reloadedSavedProduct);

      return await collection.reload({ include: models.SavedProduct });
    }

    return null;
  }
}

module.exports = WorkspaceService;
