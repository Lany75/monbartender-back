const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    nom: "Tumbler",
    created_at: now,
    updated_at: now
  },
  {
    id: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    nom: "Verre à cocktail",
    created_at: now,
    updated_at: now
  },
  {
    id: "aac971dd-7329-4579-88e7-8ca7a7c0b026",
    nom: "Flute",
    created_at: now,
    updated_at: now
  },
  {
    id: "0e5bcbdc-2659-46d1-aa5a-9a6678f448c0",
    nom: "Coupe",
    created_at: now,
    updated_at: now
  },
  {
    id: "59a64053-f074-4068-a68a-b6ca1bcc34a0",
    nom: "Verre à Margarita",
    created_at: now,
    updated_at: now
  },
  {
    id: "2763d10c-50d3-4029-a3ea-b6c76a1ab9bf",
    nom: "Verre à whisky",
    created_at: now,
    updated_at: now
  },
  {
    id: "e375c137-77e9-4682-9d9d-f8b46a7147a6",
    nom: "Verre à shot",
    created_at: now,
    updated_at: now
  },
  {
    id: "4caf20ea-b7d4-468d-bdd8-cde6cb8e0623",
    nom: "Verre ballon",
    created_at: now,
    updated_at: now
  },
  {
    id: "06dcf3b1-6978-4575-8fe7-e2a35478ce24",
    nom: "Verre à bière",
    created_at: now,
    updated_at: now
  },
  {
    id: "351efe5d-c697-4e1a-a47c-ad555a800ed3",
    nom: "Chope",
    created_at: now,
    updated_at: now
  }
];
