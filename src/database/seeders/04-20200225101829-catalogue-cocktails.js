const catalogueCocktails = require("../seeds/20200225102033-catalogue-cocktails");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("cocktails", catalogueCocktails);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("cocktails", null, {});
  }
};
