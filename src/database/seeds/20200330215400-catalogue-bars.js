const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: uuid(),
    personne_id: "mlanie.parry@gmail.com",
    droits: true,
    created_at: now,
    updated_at: now
  }
];
