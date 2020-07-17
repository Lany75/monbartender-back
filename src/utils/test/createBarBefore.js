const { Bar, BarIngredient } = require("../../models");

const existingUnitTestUserBarId = "38925fb2-2267-47c7-b62e-e134e41a51c7";
const existingUnitTestUser = "unit-testing@monbartender.com";

const createBarBefore = async () => {
  // Create a bar with an ingredient
  await Bar.create({
    id: existingUnitTestUserBarId,
    personneId: existingUnitTestUser,
    droits: true
  });
  await BarIngredient.create({
    barId: existingUnitTestUserBarId,
    ingredientId: "64b1111d-8ab9-4051-887b-90a275cec851" // Sel de Celeri
  });
};

module.exports = createBarBefore;
