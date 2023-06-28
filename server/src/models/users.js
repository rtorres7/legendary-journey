const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
    },

    lastName: {
      type: DataTypes.STRING,
    },

    firstName: {
      type: DataTypes.STRING,
    },

    userName: {
      type: DataTypes.STRING,
    },

    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    hasOrg: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    phone: {
      type: DataTypes.INTEGER,
    },

    dn: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  });
};
