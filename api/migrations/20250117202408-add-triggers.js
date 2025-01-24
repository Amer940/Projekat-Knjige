'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    
    // trigger za ubacivanje podataka i update stanja 
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_insert_iznajmljeno
      AFTER INSERT ON iznajmljeno
      FOR EACH ROW
      UPDATE knjige
      SET 
        rentedNum = rentedNum + 1,
        quantity = quantity - 1
      WHERE id = NEW.bookid;  
    `);

    // trigger nakon brisanja iznajmljenih i update stanja 
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_delete_iznajmljeno
      AFTER DELETE ON iznajmljeno
      FOR EACH ROW
      UPDATE knjige
      SET 
        rentedNum = rentedNum - 1,
        quantity = quantity + 1
      WHERE id = OLD.bookid; 
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_insert_iznajmljeno');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS after_delete_iznajmljeno');
  }
};
