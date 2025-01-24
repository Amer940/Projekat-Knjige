'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class organizacije extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  organizacije.init({
    allowNull: false,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'organizacije',
    freezeTableName: true,
  });
  return organizacije;
};