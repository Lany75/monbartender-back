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

  getIdCategorie: async (name) => {
    const categorieId = await CategorieIngredient.findOne({
      attributes: ['id'],
      where: { nom: name }
    })

    return categorieId?.dataValues.id;
  },
}

module.exports = categoriesIngredientsV2;