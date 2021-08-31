const uuid = require("uuid");
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

  getNameIngredient: async (ingredientName) => {
    const ingredient = await Ingredient.findOne({
      attributes: ['id', 'nom'],
      where: { nom: ingredientName }
    })

    return ingredient?.dataValues;
  },

  putOneIngredient: async (ingredientId, nom, categorieId) => {
    await Ingredient.update(
      {
        nom: nom,
        categorieId: categorieId
      },
      {
        where: { id: ingredientId },
      }
    )
  },

  ingredientIdIsExisting: async ingredientId => {
    const ingredient = await Ingredient.findOne({
      attributes: ['id'],
      where: { id: ingredientId }
    })

    if (ingredient) return true;
    else return false;
  },

  addIngredient: async (nomIngredient, categorieId) => {
    await Ingredient.create({
      id: uuid(),
      nom: nomIngredient,
      categorieId: categorieId
    })
  },

  deleteIngredient: async (ingredientId) => {
    await Ingredient.destroy({
      where: {
        id: ingredientId
      }
    })
  },

  categoryIsUsed: async categoryId => {
    const category = await Ingredient.findOne({
      attributes: ['categorieId'],
      where: { categorieId: categoryId }
    })

    if (category) return true;
    else return false;
  }
}

module.exports = ingredientsControllerV2;