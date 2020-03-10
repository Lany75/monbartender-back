const catalogueBarsIngredients = require("../seeds/20200306144100-catalogue-bars-ingredients");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "bars_ingredients",
      catalogueBarsIngredients
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("bars_ingredients", null, {});
  }
};
