const catalogueVerres = require('../seeds/20210910172600-catalogue-unites');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('unites', catalogueVerres);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('unites', null, {});
  }
};