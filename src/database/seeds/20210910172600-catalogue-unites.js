const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: '0a02c041-235d-4382-892d-72b87ea000fa',
    nom: "feuille(s)",
    createdAt: now,
    updatedAt: now
  },
  {
    id: '70a07305-7a87-48c2-97d9-db69b2b53953',
    nom: "gr",
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'e62f73e2-fa06-4f66-bc5a-47e349e1a6cd',
    nom: "cl",
    createdAt: now,
    updatedAt: now
  },
  {
    id: '0fee5a7d-fe97-47f9-bb5d-b9ea5cebd665',
    nom: "goutte(s)",
    createdAt: now,
    updatedAt: now
  },
]