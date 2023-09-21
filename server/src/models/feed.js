const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Feed",
    {
      name: DataTypes.STRING,
      searchParams: DataTypes.STRING,
      selectedReadings: DataTypes.ARRAY(DataTypes.STRING),
      // selectedReadings: {
      //   type: DataTypes.ARRAY(DataTypes.STRING),
      //   allowNull: false,
      //   get() {
      //     return this.getDataValue("selectedReadings").join("\n");
      //   },
      //   set(val) {
      //     this.setDataValue("selectedReadings", val.split("\n"));
      //   },
      // },
      state: DataTypes.STRING,
      position: DataTypes.INTEGER,
      classification: DataTypes.STRING,
      classificationXml: DataTypes.STRING,
    },
    {
      tableName: "feeds",
      underscored: true,
      updatedAt: false,
    },
  );
};
