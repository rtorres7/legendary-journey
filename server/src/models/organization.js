const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Organization = sequelize.define(
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
  return Organization;
};
