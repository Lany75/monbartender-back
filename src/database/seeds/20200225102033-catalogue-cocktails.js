const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: uuid(),
    nom: "Mojito",
    //verres_id: uuid(),
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés, puis le rhum à hauteur des glacons. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Bloody Mary",
    //verres_id: uuid(),
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés, puis le rhum à hauteur des glacons. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    created_at: now,
    updated_at: now
  }
];
