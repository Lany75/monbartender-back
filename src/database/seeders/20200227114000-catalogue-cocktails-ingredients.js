const catalogueCocktailsIngredients = require("../seeds/20200227114100-catalogue-cocktails-ingredients");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "cocktails_ingredients",
      catalogueCocktailsIngredients
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("cocktails_ingredients", null, {});
  }
};
