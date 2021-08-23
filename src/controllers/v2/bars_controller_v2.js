const { Bar, Ingredient, CategorieIngredient } = require('../../models');
const uuid = require('uuid');

const barControllerV2 = {
  getAllBars: async () => {
    const bars = await Bar.findAll({
      attributes: ['id', 'personneId', 'droits'],
      order: [["personneId", "ASC"]],
    })

    return bars
  },

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
  },

  createUserBar: async mail => {
    await Bar.create({
      id: uuid(),
      personneId: mail,
      droits: false
    });
  }
}

module.exports = barControllerV2;