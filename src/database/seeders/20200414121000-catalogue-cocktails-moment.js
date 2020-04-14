const catalogueCocktailsMoment = require("../seeds/20200414121000-catalogue-cocktails-moment");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "cocktails_moment",
      catalogueCocktailsMoment
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("cocktails_moment", null, {});
  }
};
