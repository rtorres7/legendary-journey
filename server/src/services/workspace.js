const { models } = require('../data/sequelize');
const { KiwiPage, KiwiSort } = require("@kiwiproject/kiwi-js");

class WorkspaceService {
  async findPageOfSavedProductsForUser(userId, page, limit, offset, sortDir) {
    const { count, rows } = await models.SavedProduct.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [
        ['createdAt', sortDir.toUpperCase()],
      ],
    });

    return KiwiPage.of(page, limit, count, rows)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of('createdAt', sortDir));
  }

  async createSavedProduct(productId, userId) {
    return await models.SavedProduct.create({ productId: productId, createdBy: userId });
  }

  async deleteSavedProduct(productId, userId) {
    await models.SavedProduct.destroy({
      where: {
        productId: productId,
        createdBy: userId
      },
    });
  }

  async findPageOfCollectionsForUser(userId, page, limit, offset, sortDir) {
    const { count, rows } = await models.Collection.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [
        ['createdAt', sortDir.toUpperCase()],
      ],
    });

    return KiwiPage.of(page, limit, count, rows)
      .usingOneAsFirstPage()
      .addKiwiSort(KiwiSort.of('createdAt', sortDir));
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

  async findSavedProductsInCollection(collectionId) {
    const collections = await models.Collection.findAll({ where: { id: collectionId }, include: models.SavedProduct });
    return collections.map(collection => collection.SavedProducts).flat();
  }

  async addSavedProductToCollection(collectionId, savedProductId) {
    const collection = await models.Collection.findOne({ where: { id: collectionId } });
    const savedProduct = await models.SavedProduct.findOne({ where: { id: savedProductId } });

    if (collection && savedProduct) {
      await collection.addSavedProduct(savedProduct);
      return await collection.reload({ include: models.SavedProduct });
    }

    return null;
  }

  async removeSavedProductFromCollection(collectionId, savedProductId) {
    const collection = await models.Collection.findOne({ where: { id: collectionId } });
    const savedProduct = await models.SavedProduct.findOne({ where: { id: savedProductId } });

    if (collection && savedProduct) {
      await collection.removeSavedProduct(savedProduct);
      return await collection.reload({ include: models.SavedProduct });
    }

    return null;
  }
}

module.exports = WorkspaceService;
