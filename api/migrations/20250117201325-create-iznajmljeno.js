'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('iznajmljeno', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bookid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      rentDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      rentExpireDate: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('iznajmljeno');
  }
};