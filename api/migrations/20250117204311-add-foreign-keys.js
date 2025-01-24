'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.sequelize.query(`
      ALTER TABLE iznajmljeno
      ADD CONSTRAINT userid
        FOREIGN KEY (userid)
        REFERENCES korisnici(id)
        ON DELETE RESTRICT
        ON UPDATE NO ACTION;
    `);  

    await queryInterface.sequelize.query(`
      ALTER TABLE iznajmljeno
      ADD CONSTRAINT bookid
        FOREIGN KEY (bookid)
        REFERENCES knjige(id)
        ON DELETE NO ACTION
        ON UPDATE CASCADE;
    `);  

    await queryInterface.sequelize.query(`
      ALTER TABLE korisnici
      ADD CONSTRAINT orgid
        FOREIGN KEY (organisation)
        REFERENCES organizacije(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
    `);  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE iznajmljeno
      DROP FOREIGN KEY bookid,
      DROP FOREIGN KEY userid;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE korisnici
      DROP FOREIGN KEY orgid;
    `);
  }
};
