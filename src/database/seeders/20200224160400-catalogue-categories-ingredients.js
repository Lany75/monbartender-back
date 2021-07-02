const catalogueCategoriesIngredients = require("../seeds/20200224160400-catalogue-categories-ingredients");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("categories_ingredients", catalogueCategoriesIngredients);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("categories_ingredients", null, {});
  }
};
