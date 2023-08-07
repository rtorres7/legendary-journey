const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Organization",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "organization",
      underscored: true,
    },
  );
};
