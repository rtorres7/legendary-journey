const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Collection",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      createdBy: DataTypes.BIGINT,
    },
    {
      tableName: "workspace_collections",
      underscored: true,
    },
  );
};
