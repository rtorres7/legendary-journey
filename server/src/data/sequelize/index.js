const { Sequelize } = require("sequelize");
const { config } = require("../../config/config");

let sequelize;

if (sequelize === undefined) {
  const postgresUrl = config.postgres.url;

  if (postgresUrl === "SWAGGER") {
    sequelize = { models: [] };
  } else {
    sequelize = new Sequelize(postgresUrl, {
      logging: console.log,
    });

    const modelDefiners = [
      require("../../models/collection"),
      require("../../models/saved_product"),
      require("../../models/unique_view"),
      require("../../models/total_view"),
      require("../../models/collection_products"),
      require("../../models/user"),
      require("../../models/feed"),
      require("../../models/organization"),
    ];

    for (const modelDefiner of modelDefiners) {
      modelDefiner(sequelize);
    }

    const { User, Organization, Collection, SavedProduct, CollectionProducts } =
      sequelize.models;
    Collection.belongsToMany(SavedProduct, { through: CollectionProducts });
    SavedProduct.belongsToMany(Collection, { through: CollectionProducts });
    User.belongsTo(Organization, { foreignKey: "organizationId" });
    Organization.hasMany(User, { foreignKey: "organizationId" });
  }
}

module.exports = sequelize;
