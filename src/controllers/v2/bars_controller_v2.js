const { Bar, Ingredient, CategorieIngredient } = require("../../models");

const barControllerV2 = {
  getUserBar: async mail => {
    const bar = await Bar.findOne({
      where: { personneId: mail },
      order: [
        ['personneId', 'ASC'],
        [{ model: Ingredient }, 'nom', 'ASC'],
      ],
      attributes: ['id', 'personneId', 'droits'],
      include: [
        {
          model: Ingredient,
          attributes: ['id', 'nom'],
          through: { attributes: [] },
          include: [
            {
              model: CategorieIngredient,
              attributes: ['id', 'nom']
            }
          ]
        }
      ]
    });
    return bar;
  }
}

module.exports = barControllerV2;