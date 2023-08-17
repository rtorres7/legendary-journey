const dayjs = require("dayjs");
const Article = require("../models/articles");
const ProductSearchService = require("./product-search-service");
const { KiwiPage, KiwiSort, KiwiPreconditions } = require("@kiwiproject/kiwi-js");
const { handleMongooseError } = require("../util/errors");
const _ = require("lodash");
const { ObjectStoreService } = require('./object-store-service');
const { AttachmentService } = require('./attachment-service');
const { logger } = require('../config/logger');

class ProductService {
  constructor() {
    this.productSearchService = new ProductSearchService();
    this.attachmentService = new AttachmentService();
  }

  async findAllByDate(date) {
    const day = dayjs(date);
    const start = day.startOf("day").toDate();
    const end = day.endOf("day").toDate();

    return await Article.find({
      datePublished: { $gte: start, $lte: end },
    }).exec();
  }

  async findByProductNumber(productNumber) {
    return await Article.findOne({ productNumber: productNumber }).exec();
  }

  async findById(id) {
    return await Article.findById(id).exec();
  }

  async createProduct(product) {
    const savedProduct = await product.save();

    try {
      await this.productSearchService.create(savedProduct.indexable);
    } catch (error) {
      console.log('There was a problem indexing product, rolling back database save', error);
      await Article.deleteOne({ _id: savedProduct.id });
      throw new Error('There was a problem indexing product, rolling back database save');
    }

    return savedProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await Article.findByIdAndUpdate(
      { _id: id },
      product,
      { new: true }
    ).exec();

    try {
      await this.productSearchService.update(updatedProduct.indexable);
    } catch (error) {
      console.log("There was a problem updating product in index", error);
      // TODO: Need to figure out how to roll back the update
      throw new Error("There was a problem updating product in index");
    }

    return updatedProduct;
  }

  async deleteProduct(id) {
    await Article.deleteOne({ _id: id }).exec();

    try {
      await this.productSearchService.delete(id);
    } catch (error) {
      console.log("There was a problem deleting product in index", error);
      // TODO: Need to figure out how to add the record back into the database (e.g. rollback)
      throw new Error("There was a problem deleting product in index");
    }
  }

  async findFeaturesAndBriefs() {
    const featuredProducts = await Article.find({'state': 'posted'}).sort({ _id: -1 }).exec();
    const briefProducts = await Article.find({ 'productType.code': { $in: [10377, 10379, 10380, 10384, 10385, 10386] }}).sort({ datePublished: -1 }).limit(3).exec();

    return {
      featured: featuredProducts.map((product) => product.features),
      briefs: briefProducts.map((product) => product.features),
    };
  }

  async findPageOfDraftProductsForUser(userId, page, limit, offset, sortDir) {
    const drafts = await this.#findDraftProductsForUser(
      userId,
      limit,
      offset,
      sortDir
    );
    const draftCount = await this.#countDraftProductsForUser(userId);

    return KiwiPage.of(
      page,
      limit,
      draftCount,
      drafts.map((draft) => draft.features)
    )
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("createdAt", sortDir));
  }

  async #findDraftProductsForUser(userId, limit, offset, sortDir) {
    return await Article
      .find({ state: 'draft', 'createdBy.id': userId })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: sortDir.toLowerCase() })
      .exec();
  }

  async #countDraftProductsForUser(userId) {
    return await Article
      .count({ state: 'draft', 'createdBy.id': userId })
      .exec();
  }

  async findPageOfRecentProductsForUser(userId, page, limit, offset, sortDir) {
    const recentProducts = await this.#findRecentProductsForUser(
      userId,
      limit,
      offset,
      sortDir
    );
    const recentCount = await this.#countRecentProductsForUser(userId);

    return KiwiPage.of(
      page,
      limit,
      recentCount,
      recentProducts.map((recent) => recent.features)
    )
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("datePublished", sortDir));
  }

  async #findRecentProductsForUser(userId, limit, offset, sortDir) {
    return await Article
      .find({state: 'posted', 'createdBy.id': userId })
      .limit(limit)
      .skip(offset)
      .sort({ datePublished: sortDir.toLowerCase() })
      .exec();
  }

  async #countRecentProductsForUser(userId) {
    return await Article
      .count({ state: 'posted', 'createdBy.id': userId })
      .exec();
  }

  async findPageOfRecentProductsForProducingOffice(producingOfficeName, page, limit, offset, sortDir) {
    KiwiPreconditions.checkArgumentDefined(producingOfficeName);
    const recentProducts = await this.#findRecentProductsForProducingOffice(producingOfficeName, limit, offset, sortDir);
    const recentCount = await this.#countRecentProductsForProducingOffice(producingOfficeName);
    return KiwiPage.of(page, limit, recentCount, recentProducts.map((recent) => recent.features))
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("datePublished", sortDir));
  }

  async #findRecentProductsForProducingOffice(producingOfficeName) {
    return await Article
      .find({
        $and: [
          { state: 'posted' },
          { 'producingOffices': { $elemMatch: { name: producingOfficeName } } }
        ]
      })
      .exec();
  }

  async #countRecentProductsForProducingOffice(producingOfficeName) {
    return await Article
      .count({
        $and: [
          { state: 'posted' },
          { 'producingOffices': { $elemMatch: { name: producingOfficeName } } }
        ]
      })
      .exec();
  }

  async findPageOfProductsForUser(userId, page, limit, offset, sortDir) {
    const products = await this.#findAllProductsForUser(
      userId,
      limit,
      offset,
      sortDir
    );
    const count = await this.#countAllProductsForUser(userId);

    return KiwiPage.of(
      page,
      limit,
      count,
      products.map((product) => product.features)
    )
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of("createdAt", sortDir));
  }

  async #findAllProductsForUser(userId, limit, offset, sortDir) {
    return await Article
      .find({ 'createdBy.id': userId })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: sortDir.toLowerCase() })
      .exec();
  }

  async #countAllProductsForUser(userId) {
    return await Article
      .count({ 'createdBy.id': userId })
      .exec();
  }

  async initializeProductData() {
    const indexesCreated = await this.productSearchService.createIndexesIfNecessary();

    if (indexesCreated.includes('products')) {
      try {
        const products = await Article.find().exec();
        products.forEach(product => {
          this.productSearchService.create(product.indexable);
        });
      } catch (error) {
        handleMongooseError('There was a problem initializing product seed data');
      }
    }
  }

  async addAttachment(productNumber, fileUploadedObjectInfo) {
    KiwiPreconditions.checkArgumentDefined(productNumber);
    KiwiPreconditions.checkArgumentDefined(fileUploadedObjectInfo);
    const product = await this.findByProductNumber(productNumber);
    const added = await this.attachmentService.add(product, fileUploadedObjectInfo);

    const firstPdf = product.attachmentsMetadata.find(att => att.mimeType === "application/pdf");

    if (firstPdf?.attachmentId === added.attachmentId) {
      const { metadata, stream } = await this.attachmentService.get(product, firstPdf.attachmentId);
      const chunks = [];
      stream.on('data', chunk => {
        chunks.push(chunk);
      });
      stream.on("end", async () => {
        const result = Buffer.concat(chunks);
        const base64String = result.toString("base64");
        await this.productSearchService.indexAttachment(product.id, fileUploadedObjectInfo.attachmentId, base64String);
      });
    }

    await product.save();
    await this.productSearchService.update(product.indexable);
    const metadata = this.attachmentService.findMetadata(product, added.attachmentId); // need mongo id
    return Promise.resolve(metadata);
  }

  async getAttachment(productNumber, attachmentId) {
    KiwiPreconditions.checkArgumentDefined(productNumber);
    KiwiPreconditions.checkArgumentDefined(attachmentId);
    const product = await this.findByProductNumber(productNumber);
    return await this.attachmentService.get(product, attachmentId);
  }

  async deleteAttachment(productNumber, attachmentId) {
    KiwiPreconditions.checkArgumentDefined(productNumber);
    KiwiPreconditions.checkArgumentDefined(attachmentId);
    const product = await this.findByProductNumber(productNumber);
    const metadata = await this.attachmentService.delete(product, attachmentId);
    await this.productSearchService.removeIndexedAttachment(product.id, metadata.attachmentId);
  }
}

module.exports = ProductService;
