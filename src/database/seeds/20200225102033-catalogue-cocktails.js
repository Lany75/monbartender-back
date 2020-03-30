const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: "7f73cf2f-7ed7-4be4-8640-69dbbc1b2927",
    nom: "Mojito",
    photo: "/api/images/mojito.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés, puis le rhum à hauteur des glacons. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    etapes_preparation_id: "288e112a-a831-40fc-919f-a9b987d28c6b",
    created_at: now,
    updated_at: now
  },
  {
    id: "b258592b-57ac-4bda-8e07-1d2697f20770",
    nom: "Bloody Mary",
    photo: "/api/images/bloodyMary.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés, puis le rhum à hauteur des glacons. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    etapes_preparation_id: "cc2235c4-5214-4774-82f9-100ff72e5d39",
    created_at: now,
    updated_at: now
  },
  {
    id: "7e124810-e9a7-4724-ad48-c6a24bfaa1a5",
    nom: "Margarita",
    photo: "/api/images/margarita.jpg",
    verre_id: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    etapes_preparation:
      "1. Givrer le bord d'un verre à cocktail. 2. Verser la tequila, le cointreau et le jus de citron vert dans un shaker. /n 3. Ajouter les glacons, et secouez vigoureusement pendant environ 10 secondes. /n 4. Versez dans le verre. /n 5. Décorer d'une rondelle de citron",
    etapes_preparation_id: "5d5f5ea3-0ace-4d3a-b402-83c5dec95dbc",
    created_at: now,
    updated_at: now
  },
  {
    id: "f3714a47-8359-4552-850c-277b3b56fdd0",
    nom: "Virgin Mojito",
    photo: "/api/images/mojito.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation:
      "1. Recette réalisée directement dans un verre de type \"Tumbler\". 2. Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'emsemble. 3. Ajouter les glacons pilés. 4. Compléter avec de l'eau gazeuse. 5. Décorer d'une feuille de menthe et servir avec une paille.",
    etapes_preparation_id: "afdc0d66-ae51-4c28-bf1f-d0503303ae72",
    created_at: now,
    updated_at: now
  }
];
