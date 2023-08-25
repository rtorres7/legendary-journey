const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Feed",
    {
      name: DataTypes.STRING,
      searchParams: DataTypes.STRING,
      selectedReadings: DataTypes.ARRAY(DataTypes.STRING),
      state: DataTypes.STRING,
      position: DataTypes.INTEGER,
      classification: DataTypes.STRING,
    },
    {
      tableName: "feeds",
      underscored: true,
      updatedAt: false,
    },
  );
};
