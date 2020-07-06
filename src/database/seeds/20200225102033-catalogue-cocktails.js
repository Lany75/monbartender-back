const uuid = require("uuid/v4");
const moment = require("moment");

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: "7f73cf2f-7ed7-4be4-8640-69dbbc1b2927",
    nom: "Mojito",
    photo: "img_cocktail/mojito.jpg",
    verreId: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    alcool: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "b258592b-57ac-4bda-8e07-1d2697f20770",
    nom: "Bloody Mary",
    photo: "img_cocktail/bloodyMary.jpg",
    verreId: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    alcool: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "7e124810-e9a7-4724-ad48-c6a24bfaa1a5",
    nom: "Margarita",
    photo: "img_cocktail/margarita.jpg",
    verreId: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    alcool: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "f3714a47-8359-4552-850c-277b3b56fdd0",
    nom: "Virgin Mojito",
    photo: "img_cocktail/virgin-mojito.jpg",
    verreId: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    alcool: false,
    createdAt: now,
    updatedAt: now
  }
];
