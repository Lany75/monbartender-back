const catalogueEtapesPreparation = require("../seeds/20200228215100-catalogue-etapes-preparation");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "etapes_preparation",
      catalogueEtapesPreparation
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("etapes_preparation", null, {});
  }
};
