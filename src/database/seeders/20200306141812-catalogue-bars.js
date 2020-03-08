const catalogueBars = require("../seeds/20200306142000-catalogue-bars");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("bars", catalogueBars);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("bars", null, {});
  }
};
