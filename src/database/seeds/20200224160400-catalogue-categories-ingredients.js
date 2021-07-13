const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: "66ca7575-284f-41f9-b468-7535be3a3c18",
    nom: "ALCOOL",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "8e6d7f82-95f6-40d4-ac30-9462a157b66e",
    nom: "LIQUEUR",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "52285198-dd1c-44d7-98b1-df2ef326e564",
    nom: "SOFT",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "57459a23-14dc-43e7-b730-932cee95b477",
    nom: "JUS",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "69ee0fd7-1489-4873-b036-dfeb9744d2e2",
    nom: "SIROP",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "64ba9cda-82b4-403f-8018-c954d3326fd9",
    nom: "FRUIT",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "a9a4b3ee-1e53-44cc-a5bb-f6e48d361f6a",
    nom: "LEGUME",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "f41e14e2-9bdd-47f4-95b4-1ff77022c630",
    nom: "AUTRE",
    createdAt: now,
    updatedAt: now
  }
];
