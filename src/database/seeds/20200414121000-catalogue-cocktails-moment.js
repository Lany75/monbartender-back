const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    // Mojito
    id: uuid(),
    cocktailId: "7f73cf2f-7ed7-4be4-8640-69dbbc1b2927",
    createdAt: now,
    updatedAt: now
  },
  {
    // Margarita
    id: uuid(),
    cocktailId: "7e124810-e9a7-4724-ad48-c6a24bfaa1a5",
    createdAt: now,
    updatedAt: now
  }
];
