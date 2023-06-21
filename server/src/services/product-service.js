const dayjs = require("dayjs");
const Article = require("../models/articles");
const ProductSearchService = require('../services/product-search-service');
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");

class ProductService {
  constructor() {
    this.productSearchService = new ProductSearchService()
  }

  async findAllByDate(date) {
    const day = dayjs(date);
    const start = day.startOf("day").toDate();
    const end = day.endOf("day").toDate();

    return await Article
      .find({ datePublished: { $gte: start, $lte: end } })
      .exec();
  }

  async findByProductNumber(productNumber) {
    return await Article
      .findOne({ productNumber: productNumber })
      .exec();
  }

  async findById(id) {
    return await Article
      .findById(id)
      .exec();
  }

  async createProduct(product) {
    const savedProduct = await product.save();

    try {
      await this.productSearchService.create(savedProduct.indexable);
    } catch (error) {
      console.log('There was a problem indexing product, rolling back database save', error);
      await savedProduct.remove();
      throw new Error('There was a problem indexing product, rolling back database save');
    }

    return savedProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await Article
      .findByIdAndUpdate({ _id: id }, product, { new: true })
      .exec();

    try {
      await this.productSearchService.update(updatedProduct.indexable);
    } catch (error) {
      console.log('There was a problem updating product in index', error);
      // TODO: Need to figure out how to roll back the update
      throw new Error('There was a problem updating product in index');
    }

    return updatedProduct;
  }

  async deleteProduct(id) {
    await Article.deleteOne({ _id: id }).exec();

    try {
      await this.productSearchService.delete(id);
    } catch (error) {
      console.log('There was a problem deleting product in index', error);
      // TODO: Need to figure out how to add the record back into the database (e.g. rollback)
      throw new Error('There was a problem deleting product in index')
    }
  }

  async findFeaturesAndBriefs() {
    const featuredProducts = await Article.find().sort({ _id: -1 }).exec();
    const briefProducts = await Article.find({ productTypes: { $in: [10377, 10379, 10380, 10384, 10385, 10386] }}).sort({ datePublished: -1 }).limit(3).exec();

    return {
      featured: featuredProducts.map(product => product.features),
      briefs: briefProducts.map(product => product.features)
    };
  }

  async findPageOfDraftProductsForUser(userId, page, limit, offset, sortDir) {
    const drafts = await this.#findDraftProductsForUser(userId, limit, offset, sortDir);
    const draftCount = await this.#countDraftProductsForUser(userId);

    return KiwiPage.of(page, limit, draftCount, drafts.map((draft) => draft.features))
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of('createdAt', sortDir));
  }

  async #findDraftProductsForUser(userId, limit, offset, sortDir) {
    // TODO: Need to add query for user
    return await Article
      .find({ state: 'draft' })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: sortDir.toLowerCase() })
      .exec();
  }

  async #countDraftProductsForUser(userId) {
    // TODO: Need to add query for user
    return await Article
      .count({ state: 'draft' })
      .exec();
  }

  async findPageOfRecentProductsForUser(userId, page, limit, offset, sortDir) {
    const recentProducts = await this.#findRecentProductsForUser(userId, limit, offset, sortDir);
    const recentCount = await this.#countRecentProductsForUser(userId);

    return KiwiPage.of(page, limit, recentCount, recentProducts.map((recent) => recent.features))
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of('datePublished', sortDir));
  }

  async #findRecentProductsForUser(userId, limit, offset, sortDir) {
    // TODO: Need to add query for user
    return await Article
      .find({ state: 'posted' })
      .limit(limit)
      .skip(offset)
      .sort({ datePublished: sortDir.toLowerCase() })
      .exec();
  }

  async #countRecentProductsForUser(userId) {
    // TODO: Need to add query for user
    return await Article
      .count({ state: 'posted' })
      .exec();
  }

  async findPageOfProductsForUser(userId, page, limit, offset, sortDir) {
    const products = await this.#findAllProductsForUser(userId, limit, offset, sortDir);
    const count = await this.#countAllProductsForUser(userId);

    return KiwiPage.of(page, limit, count, products.map((product) => product.features))
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of('createdAt', sortDir));
  }

  async #findAllProductsForUser(userId, limit, offset, sortDir) {
    // TODO: Need to add query for user
    return await Article
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: sortDir.toLowerCase() })
      .exec();
  }

  async #countAllProductsForUser(userId) {
    // TODO: Need to add query for user
    return await Article
      .count()
      .exec();
  }
}

module.exports = ProductService;
