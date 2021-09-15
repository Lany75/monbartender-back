const catalogueBars = require("../seeds/20200330215400-catalogue-bars");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("bars", catalogueBars);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("bars", null, {});
  }
};
