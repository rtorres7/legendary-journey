const ProductSearchService = require("./product-search-service");
const ProductService = require("./product-service");
const { ObjectStoreService } = require("./object-store-service");
const { models } = require("../data/sequelize");
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");
const _ = require("lodash");
const { findArticleImage } = require("../util/images");
const path = require("path");
const { Op } = require("sequelize");

class WorkspaceService {
  constructor() {
    this.productService = new ProductService();
    this.productSearchService = new ProductSearchService();
    this.objectStoreService = new ObjectStoreService();
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
        createdBy: userId,
      },
      attributes: ["productId"],
      order: [["createdAt", "desc"]],
    });

    return await this.runSearchFromSavedProductIds(
      sortDir,
      savedProductsForUser,
      page,
      perPage,
      filters,
      term,
    );
  }

  async runSearchFromSavedProductIds(
    sortDir,
    savedProductsForUser,
    page,
    perPage,
    filters,
    term,
  ) {
    let kiwiSort = KiwiSort.of("datePublished", sortDir);
    if (sortDir === "views") {
      kiwiSort = KiwiSort.of("views", "desc");
    } else if (sortDir === "created") {
      kiwiSort = KiwiSort.of("createdAt", "desc");
    }

    if (savedProductsForUser.length === 0) {
      return KiwiPage.of(page, perPage, 0, [])
        .usingOneAsFirstPage()
        .addKiwiSort(kiwiSort);
    }

    const savedProductIds = savedProductsForUser.map(
      (savedProduct) => savedProduct.productId,
    );
    const filtersWithUsersSavedProducts = {
      ...filters,
      id: savedProductIds,
    };

    const results = await this.productSearchService.search(
      term,
      savedProductIds.length,
      1,
      "desc",
      filtersWithUsersSavedProducts,
    );
    const resultIds = results.results.map((result) => result.id);

    let products;

    if (sortDir === "created") {
      const resultIdsForPage = resultIds.slice(0, perPage);
      const productsFound = await this.productService.findProductsForIds(
        resultIdsForPage,
        resultIdsForPage.length,
        0,
      );
      products = savedProductIds
        .map((id) =>
          _.find(productsFound, (product) => product._id.toString() === id),
        )
        .filter((product) => product !== undefined);
    } else {
      const resultIdsForPage = resultIds.slice(0, perPage);
      products = await this.productService.findProductsForIds(
        resultIdsForPage,
        resultIdsForPage.length,
        0,
        sortDir,
      );
    }

    products = products.map((product) => {
      this.applyAttachmentUsageTo(product.attachments);

      return {
        classification: product.classification,
        classificationXml: product.classificationXml,
        countries: product.countries?.map((country) => country.code),
        createdById: product.createdBy?.id,
        datePublished: product.datePublished,
        deleted: product.deleted,
        email_count: product.email_count,
        featureId: product._id.toString(),
        htmlBody: product.htmlBody,
        id: product._id.toString(),
        issues: product.issues?.map((issue) => issue.code),
        images: findArticleImage(product?.attachments),
        nonStateActors: product.nonStateActors?.map((actor) => actor.code),
        orgRestricted: product.orgRestricted,
        print_count: product.print_count,
        producingOffices: product.producingOffices?.map(
          (office) => office.code,
        ),
        productNumber: product.productNumber,
        productType: product.productType?.code,
        regions: product.regions?.map((region) => region.code),
        reportingType: product.reportingType?.code,
        state: product.state,
        subregions: product.subregions?.map((subregion) => subregion.code),
        summary: product.summary,
        summaryClassification: product.summaryClassification,
        title: product.title,
        titleClassification: product.titleClassification,
        topics: product.topics?.map((topic) => topic.code),
        updatedById: product.updatedBy?.id,
        saved: true,
        views: product.views,
      };
    });

    return KiwiPage.of(page, perPage, resultIds.length, products)
      .usingOneAsFirstPage()
      .addKiwiSort(kiwiSort)
      .addSupplementaryData({ aggregations: results.aggregations });
  }

  applyAttachmentUsageTo(attachments) {
    if (attachments) {
      attachments.forEach((attachment) => {
        const parsed = path.parse(attachment.fileName);
        const isThumbnail =
          parsed.name === "article" &&
          /^\.(jpg|jpeg|png|gif|webp)$/i.test(parsed.ext);
        attachment.usage = isThumbnail ? "article" : "";
      });
    }
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

  async findPageOfCollectionsForUser(
    userId,
    page,
    limit,
    offset,
    sortDir,
    title,
  ) {
    const query = { createdBy: userId };
    if (title) {
      query.name = { [Op.like]: `%${title}%` };
    }

    const { count, rows } = await models.Collection.findAndCountAll({
      where: query,
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

  async getCollectionImage(id) {
    const collection = await models.Collection.findByPk(id);

    if (collection.image) {
      const imageData = JSON.parse(collection.image);
      const stream = await this.objectStoreService.getObject(
        imageData.bucketName,
        imageData.objectName,
      );

      return Promise.resolve({ metadata: imageData, stream });
    }

    return Promise.resolve({ metadata: null, stream: null });
  }

  async deleteCollectionImage(id) {
    const collection = await models.Collection.findByPk(id);
    if (collection.image) {
      const imageData = JSON.parse(collection.image);
      await this.objectStoreService.removeObject(
        imageData.bucketName,
        imageData.objectName,
      );
    }
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
      attributes: ["productId"],
      order: [["createdAt", "desc"]],
      include: {
        model: models.Collection,
        where: {
          id: collectionId,
        },
      },
    });

    return await this.runSearchFromSavedProductIds(
      sortDir,
      savedProductsForUserInCollection,
      page,
      perPage,
      filters,
      term,
    );
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
