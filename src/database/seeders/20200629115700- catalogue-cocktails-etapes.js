const catalogueCocktailsEtapes = require("../seeds/20200629131900-catalogue-cocktails-etapes");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "cocktails_etapes",
      catalogueCocktailsEtapes
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("cocktails_etapes", null, {});
  }
};
