const catalogueCocktailsIngredients = require("../seeds/20200227114100-catalogue-cocktailsingredients");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("cocktailsingredients", catalogueCocktailsIngredients);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("cocktailsingredients", null, {});
  }
};