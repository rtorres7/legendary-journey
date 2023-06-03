const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('TotalView', {
    firstViewedAt: DataTypes.DATE,
    lastViewedAt: DataTypes.DATE,
    productId: DataTypes.STRING,
    totalViewCount: DataTypes.BIGINT,
  }, {
    underscored: true,
  });
};
