const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    // Mojito
    id: "288e112a-a831-40fc-919f-a9b987d28c6b",
    etape_1: 'Recette réalisée directement dans un verre de type "Tumbler".',
    etape_2:
      "Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'ensemble.",
    etape_3: "Ajouter les glacons pilés, puis le rhum à hauteur des glacons.",
    etape_4: "Compléter avec de l'eau gazeuse.",
    etape_5: "Décorer d'une feuille de menthe et servir avec une paille.",
    created_at: now,
    updated_at: now
  },
  {
    // Bloody Mary
    id: "cc2235c4-5214-4774-82f9-100ff72e5d39",
    etape_1: "Réalisez la recette dans un verre à mélange.",
    etape_2:
      "Agiter les ingrédients dans un verre à mélange avec des glaçons (pour refroidir sans trop diluer). Verser dans le verre, puis ajouter à convenance sel de céleri, sel et poivre.",
    etape_3: 'Servir dans un verre de type "Tumbler".',
    etape_4: "Décorer d'une branche de celeri.",
    created_at: now,
    updated_at: now
  },
  {
    // Margarita
    id: "5d5f5ea3-0ace-4d3a-b402-83c5dec95dbc",
    etape_1: "Givrer le bord d'un verre à cocktail.",
    etape_2:
      "Verser la tequila, le cointreau et le jus de citron vert dans un shaker.",
    etape_3:
      "Ajouter les glacons, et secouez vigoureusement pendant environ 10 secondes.",
    etape_4: "Versez dans le verre.",
    etape_5: "Décorer d'une rondelle de citron.",
    created_at: now,
    updated_at: now
  },
  {
    // Virgin Mojito
    id: "afdc0d66-ae51-4c28-bf1f-d0503303ae72",
    etape_1: 'Recette réalisée directement dans un verre de type "Tumbler".',
    etape_2:
      "Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'ensemble.",
    etape_3: "Ajouter les glacons pilés, puis l'eau gazeuse'.",
    etape_4: "Décorer d'une feuille de menthe et servir avec une paille.",
    created_at: now,
    updated_at: now
  }
];
