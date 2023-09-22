const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "CollectionProducts",
    {
      collectionId: {
        type: DataTypes.BIGINT,
        references: {
          model: sequelize.models.Collection,
          key: "id",
        },
      },
      savedProductId: {
        type: DataTypes.BIGINT,
        references: {
          model: sequelize.models.SavedProduct,
          key: "id",
        },
      },
    },
    {
      tableName: "workspace_collection_products",
      underscored: true,
      updatedAt: false,
    },
  );
};
