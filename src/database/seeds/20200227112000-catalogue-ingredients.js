const uuid = require('uuid/v4');
const moment = require('moment');

const now = moment()
  .utc()
  .toDate();

module.exports = [
  {
    id: '740367a4-dedf-4093-86d1-50eac62b2521',
    nom: 'Menthe',
    categorieId: 'f41e14e2-9bdd-47f4-95b4-1ff77022c630',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'c3fd98ec-cad4-49c9-9a74-63ca90489a0a',
    nom: 'Sucre',
    categorieId: 'f41e14e2-9bdd-47f4-95b4-1ff77022c630',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'bd799ef3-d7ae-4975-8be0-8f2397fa2b18',
    nom: 'Rhum',
    categorieId: '66ca7575-284f-41f9-b468-7535be3a3c18',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'b233195d-a090-4b96-a76d-f016c842c472',
    nom: 'Jus De Citron Jaune',
    categorieId: '57459a23-14dc-43e7-b730-932cee95b477',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'ad1d8a81-7ae6-4f5e-83a3-64889d390f8a',
    nom: 'Eau Gazeuse',
    categorieId: '52285198-dd1c-44d7-98b1-df2ef326e564',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'e624bd35-e414-4874-a406-14a7d9d24231',
    nom: 'Jus De Tomate',
    categorieId: '57459a23-14dc-43e7-b730-932cee95b477',
    createdAt: now,
    updatedAt: now
  },
  {
    id: '26d4b1dc-91bf-49ed-9399-5c50bd11b69e',
    nom: 'Vodka',
    categorieId: '66ca7575-284f-41f9-b468-7535be3a3c18',
    createdAt: now,
    updatedAt: now
  },
  {
    id: '13999790-02af-4b2e-9775-7ac19fc35f1b',
    nom: 'Sauce Worcestershire',
    categorieId: 'f41e14e2-9bdd-47f4-95b4-1ff77022c630',
    createdAt: now,
    updatedAt: now
  },
  {
    id: '6793d13b-e38c-4183-825b-df2ca8957fca',
    nom: 'Tabasco',
    categorieId: 'f41e14e2-9bdd-47f4-95b4-1ff77022c630',
    createdAt: now,
    updatedAt: now
  },
  {
    id: '64b1111d-8ab9-4051-887b-90a275cec851',
    nom: 'Sel De Celeri',
    categorieId: 'f41e14e2-9bdd-47f4-95b4-1ff77022c630',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'a2631513-a18f-4629-8bef-90a773290709',
    nom: 'Tequila',
    categorieId: '66ca7575-284f-41f9-b468-7535be3a3c18',
    createdAt: now,
    updatedAt: now
  },
  {
    id: '5ef2e951-3704-43cf-b062-f60eac65ec5d',
    nom: 'Triple Sec',
    categorieId: '66ca7575-284f-41f9-b468-7535be3a3c18',
    createdAt: now,
    updatedAt: now
  },
  {
    id: '38925fb2-2267-47c7-b62e-e134e41a51c7',
    nom: 'Jus De Citron Vert',
    categorieId: '57459a23-14dc-43e7-b730-932cee95b477',
    createdAt: now,
    updatedAt: now
  }
];
