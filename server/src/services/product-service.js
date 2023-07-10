const dayjs = require("dayjs");
const Product = require("../models/products");
const ProductSearchService = require("../services/product-search-service");
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");
const { handleMongooseError } = require("../util/errors");

class ProductService {
  constructor() {
    this.productSearchService = new ProductSearchService();
  }

  async findAllByDate(date) {
    const day = dayjs(date);
    const start = day.startOf("day").toDate();
    const end = day.endOf("day").toDate();

    return await Product.find({
      datePublished: { $gte: start, $lte: end },
    }).exec();
  }

  async findByProductNumber(productNumber) {
    return await Product.findOne({ productNumber: productNumber }).exec();
  }

  async findById(id) {
    return await Product.findById(id).exec();
  }

  async createProduct(product) {
    const savedProduct = await product.save();

    try {
      await this.productSearchService.create(savedProduct.indexable);
    } catch (error) {
      console.log('There was a problem indexing product, rolling back database save', error);
      await Product.deleteOne({ _id: savedProduct.id });
      throw new Error('There was a problem indexing product, rolling back database save');
    }

    return savedProduct;
  }

  async updateProduct(id, product) {
    const updatedProduct = await Product.findByIdAndUpdate(
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
    await Product.deleteOne({ _id: id }).exec();

    try {
      await this.productSearchService.delete(id);
    } catch (error) {
      console.log("There was a problem deleting product in index", error);
      // TODO: Need to figure out how to add the record back into the database (e.g. rollback)
      throw new Error("There was a problem deleting product in index");
    }
  }

  async findFeaturesAndBriefs() {
    const featuredProducts = await Product.find().sort({ _id: -1 }).exec();
    const briefProducts = await Product.find({ 'productType.code': { $in: [10377, 10379, 10380, 10384, 10385, 10386] }}).sort({ datePublished: -1 }).limit(3).exec();

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
    return await Product
      .find({ state: 'draft', 'createdBy.id': userId })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: sortDir.toLowerCase() })
      .exec();
  }

  async #countDraftProductsForUser(userId) {
    return await Product
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
    return await Product
      .find({ state: 'posted', 'createdBy.id': userId })
      .limit(limit)
      .skip(offset)
      .sort({ datePublished: sortDir.toLowerCase() })
      .exec();
  }

  async #countRecentProductsForUser(userId) {
    return await Product
      .count({ state: 'posted', 'createdBy.id': userId })
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
    return await Product
      .find({ 'createdBy.id': userId })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: sortDir.toLowerCase() })
      .exec();
  }

  async #countAllProductsForUser(userId) {
    return await Product
      .count({ 'createdBy.id': userId })
      .exec();
  }

  async initializeProductData() {
    const indexesCreated = await this.productSearchService.createIndexesIfNecessary();

    if (indexesCreated.includes('products')) {
      try {
        const products = await Product.find().exec();
        products.forEach(product => {
          this.productSearchService.create(product.indexable);
        });
      } catch (error) {
        handleMongooseError('There was a problem initializing product seed data');
      }
    }
  }
}

module.exports = ProductService;
