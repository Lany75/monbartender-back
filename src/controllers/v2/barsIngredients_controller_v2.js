const { BarIngredient } = require("../../models");

const barIngredientsControllerV2 = {
  deleteIngredientBars: async ingredientId => {
    await BarIngredient.destroy({
      where: {
        ingredientId: ingredientId
      }
    })
  },

  postIngredientInUserBar: async (ingredientId, userId) => {
    await BarIngredient.create({
      barId: userId,
      ingredientId: ingredientId
    })
  },

  ingredientAlreadyInBar: async (ingredientId, userId) => {
    const barIngredient = await BarIngredient.findOne({
      attributes: ['barId', 'ingredientId'],
      where: { barId: userId, ingredientId: ingredientId },
    })

    if (barIngredient) return true;
    else return false
  },

  deleteIngredientFromUserBar: async (ingredientId, userId) => {
    await BarIngredient.destroy({
      where: {
        barId: userId,
        ingredientId: ingredientId
      }
    })
  }
}

module.exports = barIngredientsControllerV2;