const catalogueIngredients = require("../seeds/20200227112000-catalogue-ingredients");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("ingredients", catalogueIngredients);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("ingredients", null, {});
  }
};
