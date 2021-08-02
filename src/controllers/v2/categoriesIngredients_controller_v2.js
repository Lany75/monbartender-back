const uuid = require("uuid");
const { CategorieIngredient } = require('../../models');

const categoriesIngredientsV2 = {
  getAllCategories: async () => {
    const categories = await CategorieIngredient.findAll({
      order: [['nom', 'ASC']],
      attributes: ['id', 'nom'],
      raw: true
    })

    return (categories);
  },

  getNameCategory: async (categoryName) => {
    const category = await CategorieIngredient.findOne({
      attributes: ['id', 'nom'],
      where: { nom: categoryName }
    })

    return category?.dataValues;
  },

  getIdCategorie: async (name) => {
    const categorieId = await CategorieIngredient.findOne({
      attributes: ['id'],
      where: { nom: name }
    })

    return categorieId?.dataValues.id;
  },

  addCategory: async (CategoryName) => {
    await CategorieIngredient.create({
      id: uuid(),
      nom: CategoryName
    })
  },

  categoryIdIsExisting: async categoryId => {
    const category = await CategorieIngredient.findOne({
      attributes: ['id'],
      where: { id: categoryId }
    })

    if (category) return true;
    else return false;
  },

  putOneCategory: async (categoryId, nom) => {
    await CategorieIngredient.update(
      {
        nom: nom,
      },
      {
        where: { id: categoryId },
      }
    )
  },

  deleteCategoryIngredient: async categoryId => {
    await CategorieIngredient.destroy({
      where: {
        id: categoryId
      }
    })
  }
}

module.exports = categoriesIngredientsV2;