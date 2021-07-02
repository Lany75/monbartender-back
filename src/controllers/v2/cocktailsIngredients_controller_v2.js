const { CocktailIngredient } = require("../../models");

const cocktailsIngredientControllerV2 = {
  ingredientIsUsed: async (ingredientId) => {
    const ingredient = await CocktailIngredient.findOne({
      attributes: ['ingredientId'],
      where: { ingredientId: ingredientId }
    })

    if (ingredient) return true;
    else return false;
  }
}

module.exports = cocktailsIngredientControllerV2;