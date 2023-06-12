const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('SavedProduct', {
    productId: DataTypes.STRING,
    createdBy: DataTypes.BIGINT,
  }, {
    tableName: 'workspace_saved_products',
    underscored: true,
    updatedAt: false
  });
};
