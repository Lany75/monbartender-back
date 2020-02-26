const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: uuid(),
    nom: "Mojito",
    photo: "/api/images/mojito.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés, puis le rhum à hauteur des glacons. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Bloody Mary",
    photo: "/api/images/bloodyMary.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés, puis le rhum à hauteur des glacons. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    created_at: now,
    updated_at: now
  },
  {
    id: uuid(),
    nom: "Margarita",
    photo: "/api/images/margarita.jpg",
    verre_id: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    etapes_preparation:
      "1. Givrer le bord d'un verre à cocktail. /n 2. Verser la tequila, le cointreau et le jus de citron vert dans un shaker. /n 3. Ajouter les glacons, et secouez vigoureusement pendant environ 10 secondes. /n 4. Versez dans le verre. /n 5. Décorer d'une rondelle de citron",
    created_at: now,
    updated_at: now
  }
];
