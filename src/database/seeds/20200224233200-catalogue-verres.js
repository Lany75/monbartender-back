const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: uuid(),
    nom: "Tumbler",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Verre à cocktail",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Flute",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Coupe",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Verre à Margarita",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Verre à whisky",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Verre à shot",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Verre ballon",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Verre à bière",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Chope",
    created_at: now,
    updated_at: now
  }
];
