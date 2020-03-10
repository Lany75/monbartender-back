const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: "c69f3a25-903e-4579-807b-4fbcf682bda0",
    personne_id: "mlanie.parry@gmail.com",
    created_at: now,
    updated_at: now
  },
  {
    id: "83088787-1e00-475c-9edc-3c0bd764177a",
    personne_id: "mel@mel.com",
    created_at: now,
    updated_at: now
  }
];
