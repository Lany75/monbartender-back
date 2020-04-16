const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    // Mojito
    id: uuid(),
    cocktail_id: "7f73cf2f-7ed7-4be4-8640-69dbbc1b2927",
    created_at: now,
    updated_at: now
  },
  {
    // Margarita
    id: uuid(),
    cocktail_id: "7e124810-e9a7-4724-ad48-c6a24bfaa1a5",
    created_at: now,
    updated_at: now
  }
];
