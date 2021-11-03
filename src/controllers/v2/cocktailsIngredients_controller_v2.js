const { CocktailIngredient } = require("../../models");

const cocktailsIngredientControllerV2 = {
  ingredientIsUsed: async (ingredientId) => {
    const ingredient = await CocktailIngredient.findOne({
      attributes: ['ingredientId'],
      where: { ingredientId: ingredientId }
    })

    if (ingredient) return true;
    else return false;
  },

  unityIsUsed: async (unityName) => {
    const ingredient = await CocktailIngredient.findOne({
      attributes: ['ingredientId'],
      where: { unite: unityName }
    })

    if (ingredient) return true;
    else return false;
  },

  bindCocktailIngredient: async (idCocktail, idIngredient, quantite, unite) => {
    if (quantite === "" || unite === "") {
      await CocktailIngredient.create({
        cocktailId: idCocktail,
        ingredientId: idIngredient
      });
    } else {
      await CocktailIngredient.create({
        cocktailId: idCocktail,
        ingredientId: idIngredient,
        quantite: quantite,
        unite: unite
      });
    }
  }
}

module.exports = cocktailsIngredientControllerV2;