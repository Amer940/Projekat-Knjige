'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class iznajmljeno extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  iznajmljeno.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rentExpireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'iznajmljeno',
    freezeTableName: true,
  });
  return iznajmljeno;
};