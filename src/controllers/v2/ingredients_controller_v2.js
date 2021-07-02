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
        returning: true,
        plain: true
      }
    )
      .then(result => {
        return (result[1].dataValues);
      });
  },

  idIsExisting: async ingredientId => {
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
  }
}

module.exports = ingredientsControllerV2;