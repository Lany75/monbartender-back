const { Ingredient, CategorieIngredient } = require('../../models');

const ingredientsControllerV2 = {
  getAllIngredients: async () => {
    const ingredients = await Ingredient.findAll({
      order: [['nom', 'ASC']],
      attributes: ['id', 'nom'],
      include: [
        {
          model: CategorieIngredient,
          attributes: ['id', 'nom']
        }
      ]
    })

    return ingredients;
  },

  putOneIngredient: async (ingredientId, nom, categorieId) => {
    await Ingredient.update(
      {
        nom: nom,
        categorieId: categorieId
      },
      {
        where: { id: ingredientId },
        returning: true,
        plain: true
      }
    )
      .then(result => {
        return (result[1].dataValues);
      });
  }
}

module.exports = ingredientsControllerV2;