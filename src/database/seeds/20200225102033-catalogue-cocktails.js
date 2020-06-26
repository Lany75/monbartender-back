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
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation_id: "288e112a-a831-40fc-919f-a9b987d28c6b",
    created_at: now,
    updated_at: now
  },
  {
    id: "b258592b-57ac-4bda-8e07-1d2697f20770",
    nom: "Bloody Mary",
    photo: "img_cocktail/bloodyMary.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation_id: "cc2235c4-5214-4774-82f9-100ff72e5d39",
    created_at: now,
    updated_at: now
  },
  {
    id: "7e124810-e9a7-4724-ad48-c6a24bfaa1a5",
    nom: "Margarita",
    photo: "img_cocktail/margarita.jpg",
    verre_id: "c69758d1-b4ad-4038-b157-205fd12d9ace",
    etapes_preparation_id: "5d5f5ea3-0ace-4d3a-b402-83c5dec95dbc",
    created_at: now,
    updated_at: now
  },
  {
    id: "f3714a47-8359-4552-850c-277b3b56fdd0",
    nom: "Virgin Mojito",
    photo: "img_cocktail/virgin-mojito.jpg",
    verre_id: "0ec43307-8523-48c6-8fd9-06be72e484bd",
    etapes_preparation_id: "afdc0d66-ae51-4c28-bf1f-d0503303ae72",
    created_at: now,
    updated_at: now
  }
];
