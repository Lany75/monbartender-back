const { BarIngredient } = require("../../models");

const barIngredientsControllerV2 = {
  deleteIngredientBars: async ingredientId => {
    await BarIngredient.destroy({
      where: {
        ingredientId: ingredientId
      }
    })
  }
}

module.exports = barIngredientsControllerV2;