const AggregatedMetricsService = require("./aggregated-metrics-service");
const ProductSearchService = require("./product-search-service");
const { models } = require("../data/sequelize");
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");

class WorkspaceService {
  constructor() {
    this.productSearchService = new ProductSearchService();
    this.metricsService = new AggregatedMetricsService();
  }

  async findPageOfSavedProductsForUser(
    userId,
    term,
    perPage = 10,
    page = 1,
    sortDir = "desc",
    filters = {},
  ) {
    const savedProductsForUser = await models.SavedProduct.findAll({
      where: {
        createdBy: userId
      },
      attributes: ["productId"]
    });

    if (savedProductsForUser.length === 0) {
      return KiwiPage.of(page, perPage, 0, [])
        .usingOneAsFirstPage()
        .addKiwiSort(
          KiwiSort.of(sortDir === "views" ? "views" : "datePublished", sortDir),
        );
    }

    const savedProductIds = savedProductsForUser.map(savedProduct => savedProduct.productId);
    const filtersWithUsersSavedProducts = {
      ...filters,
      id: savedProductIds,
    };

    const resolvedSortDir = sortDir === "views" ? "asc" : sortDir;
    const results = await this.productSearchService.search(term, perPage, page, resolvedSortDir, filtersWithUsersSavedProducts);

    if (sortDir === "views") {
      const productNumbers = results.results.map(
        (product) => product.productNumber,
      );

      const productViews =
        await this.metricsService.getProductViewsCountForMultipleProducts(
          productNumbers,
        );

      results.results.forEach((product) => {
        product.views = productViews[product.productNumber] || 0;
      });

      results.results.sort((a, b) => b.views - a.views);
    }

    return KiwiPage.of(page, perPage, results.totalCount, results.results)
      .usingOneAsFirstPage()
      .addKiwiSort(
        KiwiSort.of(sortDir === "views" ? "views" : "datePublished", sortDir),
      )
      .addSupplementaryData({ aggregations: results.aggregations });
  }

  async createSavedProduct(productId, userId) {
    const savedProductResponse = await models.SavedProduct.findCreateFind({
      where: {
        productId: productId,
        createdBy: userId,
      },
      defaults: {
        productId: productId,
        createdBy: userId,
      },
    });

    return savedProductResponse["0"];
  }

  async deleteSavedProduct(productId, userId) {
    await models.SavedProduct.destroy({
      where: {
        productId: productId,
        createdBy: userId,
      },
    });
  }

  async deleteSavedProductForAllUsers(productId) {
    await models.SavedProduct.destroy({
      where: {
        productId: productId,
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

  async findSavedProductsInCollection(
    collectionId,
    term,
    perPage = 10,
    page = 1,
    sortDir = "desc",
    filters = {},
  ) {
    const savedProductsForUserInCollection = await models.SavedProduct.findAll({
      include: {
        model: models.Collection,
        where: {
          id: collectionId
        }
      }
    });

    const savedProductIds = savedProductsForUserInCollection.map(savedProduct => savedProduct.productId);
    const filtersWithUsersSavedProducts = {
      ...filters,
      id: savedProductIds,
    };

    const results = await this.productSearchService.search(term, perPage, page, sortDir, filtersWithUsersSavedProducts);

    results.results.forEach((product) => {
      product.saved = true;
    });

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
      return await collection.reload({ include: models.SavedProduct });
    }

    return null;
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
      return await collection.reload({ include: models.SavedProduct });
    }

    return null;
  }

  async isProductSaved(userId, productId) {
    const savedProduct = await models.SavedProduct.findOne({
      where: {
        productId: productId,
        createdBy: userId,
      },
    });

    return savedProduct !== null;
  }
}

module.exports = WorkspaceService;
