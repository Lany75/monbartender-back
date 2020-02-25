const catalogueVerres = require("../seeds/20200224233200-catalogue-verres");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("verres", catalogueVerres);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("verres", null, {});
  }
};
