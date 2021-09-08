const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    // Mojito etape 1
    id: "e132fd2a-56b7-4a13-91ad-d4883a970baf",
    numEtape: 1,
    texte: 'Recette réalisée directement dans un verre de type "Tumbler".',
    cocktailId: '7f73cf2f-7ed7-4be4-8640-69dbbc1b2927',
    createdAt: now,
    updatedAt: now
  },
  {
    // Mojito etape 2
    id: "aa00ab00-02de-44af-b5ab-cf808d18e82f",
    numEtape: 2,
    texte:
      "Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'ensemble.",
    cocktailId: '7f73cf2f-7ed7-4be4-8640-69dbbc1b2927',
    createdAt: now,
    updatedAt: now
  },
  {
    // Mojito etape 3
    id: "ec0cfbb1-5911-46c1-a479-84fce3c62ddc",
    numEtape: 3,
    texte: "Ajouter les glacons pilés, puis le rhum à hauteur des glacons.",
    cocktailId: '7f73cf2f-7ed7-4be4-8640-69dbbc1b2927',
    createdAt: now,
    updatedAt: now
  },
  {
    // Mojito etape 4
    id: "4528e3ec-be76-4202-ac1e-585a08f67dad",
    numEtape: 4,
    texte: "Compléter avec de l'eau gazeuse.",
    cocktailId: '7f73cf2f-7ed7-4be4-8640-69dbbc1b2927',
    createdAt: now,
    updatedAt: now
  },
  {
    // Mojito etape 5
    id: "9bec4f6b-3516-4991-a888-540f3272694f",
    numEtape: 5,
    texte: "Décorer d'une feuille de menthe et servir avec une paille.",
    cocktailId: '7f73cf2f-7ed7-4be4-8640-69dbbc1b2927',
    createdAt: now,
    updatedAt: now
  },

  {
    // Bloody Mary etape 1
    id: "7fe02232-a8f4-456d-ad52-cde165adad16",
    numEtape: 1,
    texte: "Réalisez la recette dans un verre à mélange.",
    cocktailId: 'b258592b-57ac-4bda-8e07-1d2697f20770',
    createdAt: now,
    updatedAt: now
  },
  {
    // Bloody Mary etape 2
    id: "398ec5e2-7865-4808-9e76-49a475ac2288",
    numEtape: 2,
    texte:
      "Agiter les ingrédients dans un verre à mélange avec des glaçons (pour refroidir sans trop diluer).",
    cocktailId: 'b258592b-57ac-4bda-8e07-1d2697f20770',
    createdAt: now,
    updatedAt: now
  },
  {
    // Bloody Mary etape 3
    id: "bc270049-d689-4ee9-bbcd-da8f1863ddb9",
    numEtape: 3,
    texte:
      "Verser dans le verre, puis ajouter à votre convenance le sel de céleri.",
    cocktailId: 'b258592b-57ac-4bda-8e07-1d2697f20770',
    createdAt: now,
    updatedAt: now
  },
  {
    // Bloody Mary etape 4
    id: "0b30b16a-b8e1-4c66-b49e-fd7e6a425a48",
    numEtape: 4,
    texte: 'Servir dans un verre de type "Tumbler".',
    cocktailId: 'b258592b-57ac-4bda-8e07-1d2697f20770',
    createdAt: now,
    updatedAt: now
  },
  {
    // Bloody Mary etape 5
    id: "56e49143-164d-4dda-913f-c7da253e8a82",
    numEtape: 5,
    texte: "Décorer d'une branche de celeri.",
    cocktailId: 'b258592b-57ac-4bda-8e07-1d2697f20770',
    createdAt: now,
    updatedAt: now
  },

  {
    // Margarita etape 1
    id: "0d36c58c-ab65-4a5c-9fc5-f71d4022e3e6",
    numEtape: 1,
    texte: "Givrer le bord d'un verre à cocktail.",
    cocktailId: '7e124810-e9a7-4724-ad48-c6a24bfaa1a5',
    createdAt: now,
    updatedAt: now
  },
  {
    // Margarita etape 2
    id: "8788b31d-5f6e-48ba-a847-220255bb7e90",
    numEtape: 2,
    texte:
      "Verser la tequila, le cointreau et le jus de citron vert dans un shaker.",
    cocktailId: '7e124810-e9a7-4724-ad48-c6a24bfaa1a5',
    createdAt: now,
    updatedAt: now
  },
  {
    // Margarita etape 3
    id: "93ab24b2-bc51-4f9f-bdc9-0442cb71b3c5",
    numEtape: 3,
    texte:
      "Ajouter les glacons, et secouez vigoureusement pendant environ 10 secondes.",
    cocktailId: '7e124810-e9a7-4724-ad48-c6a24bfaa1a5',
    createdAt: now,
    updatedAt: now
  },
  {
    // Margarita etape 4
    id: "fd802959-a288-4265-b744-ad4e29feab2f",
    numEtape: 4,
    texte: "Versez dans le verre.",
    cocktailId: '7e124810-e9a7-4724-ad48-c6a24bfaa1a5',
    createdAt: now,
    updatedAt: now
  },
  {
    // Margarita etape 5
    id: "2e438d8a-093b-4b29-9e92-59271a94a03c",
    numEtape: 5,
    texte: "Décorer d'une rondelle de citron.",
    cocktailId: '7e124810-e9a7-4724-ad48-c6a24bfaa1a5',
    createdAt: now,
    updatedAt: now
  },

  {
    // Virgin Mojito etape 1
    id: "36b4e87f-ee3c-4d1e-9875-40701dc53da6",
    numEtape: 1,
    texte: 'Recette réalisée directement dans un verre de type "Tumbler".',
    cocktailId: 'f3714a47-8359-4552-850c-277b3b56fdd0',
    createdAt: now,
    updatedAt: now
  },
  {
    // Virgin Mojito etape 2
    id: "604f3c47-3233-4e90-bd79-92da5154bea5",
    numEtape: 2,
    texte:
      "Placer les feuilles de menthe dans le verre, ajouter le sucre et le citron coupé en morceau. Piler l'ensemble.",
    cocktailId: 'f3714a47-8359-4552-850c-277b3b56fdd0',
    createdAt: now,
    updatedAt: now
  },
  {
    // Virgin Mojito etape 3
    id: "75e46d7e-5a1c-4a2b-acc4-5f1e179914a7",
    numEtape: 3,
    texte: "Ajouter les glacons pilés, puis l'eau gazeuse.",
    cocktailId: 'f3714a47-8359-4552-850c-277b3b56fdd0',
    createdAt: now,
    updatedAt: now
  },
  {
    // Virgin Mojito etape 4
    id: "8f09ee71-b660-4c61-ae77-60a315d59313",
    numEtape: 4,
    texte: "Décorer d'une feuille de menthe et servir avec une paille.",
    cocktailId: 'f3714a47-8359-4552-850c-277b3b56fdd0',
    createdAt: now,
    updatedAt: now
  }
];
