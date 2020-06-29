const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: uuid(),
    personneId: "mlanie.parry@gmail.com",
    droits: true,
    createdAt: now,
    updatedAt: now
  }
];
