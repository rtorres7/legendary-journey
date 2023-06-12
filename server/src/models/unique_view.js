const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('UniqueView', {
    firstViewedAt: DataTypes.DATE,
    lastViewedAt: DataTypes.DATE,
    productId: DataTypes.STRING,
    viewedBy: DataTypes.BIGINT,
  }, {
    underscored: true,
  });
};
