const { Sequelize } = require("sequelize");

let sequelize;

if (sequelize === undefined) {
  sequelize = new Sequelize(process.env.POSTGRES_CONNECTION_URL, {
    logging: console.log,
  });

  const modelDefiners = [
    require('../../models/collection'),
    require('../../models/saved_product'),
    require('../../models/unique_view'),
    require('../../models/total_view'),
    require('../../models/collection_products'),
    require("../../models/users"),
  ];

  for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
  }

  const { Collection, SavedProduct, CollectionProducts } = sequelize.models;
  Collection.belongsToMany(SavedProduct, { through: CollectionProducts });
  SavedProduct.belongsToMany(Collection, { through: CollectionProducts });
}

module.exports = sequelize;
