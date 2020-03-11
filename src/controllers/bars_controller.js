const { Bar, Ingredient, BarIngredient } = require("../models");
const uuid = require("uuid");

const barController = {
  recupererLesBars: async () => {
    const bars = await Bar.findAll({
      attributes: ["id", "personne_id"],
      raw: true
    });
    return bars;
  },

  recupererUnBar: async mail => {
    const bar = await Bar.findOne({
      where: { personne_id: mail },
      attributes: ["id", "personne_id"],
      include: [
        {
          model: Ingredient,
          attributes: ["nom"],
          through: { attributes: [] }
        }
      ]
    });
    return bar;
  },

  recupererIdBar: async mail => {
    const barId = await Bar.findOne({
      where: { personne_id: mail },
      attributes: ["id"]
    });
    return barId;
  },

  creerUnBar: async mail => {
    await Bar.create({
      id: uuid(),
      personneId: mail
    });
  },

  ajouterUnIngredientAuBar: async (ingredientId, userId) => {
    await BarIngredient.create({
      barId: userId,
      ingredientId: ingredientId
    });
  },

  supprimerUnIngredientDuBar: async (ingredientId, userId) => {
    await BarIngredient.destroy({
      where: {
        bar_id: userId,
        ingredient_id: ingredientId
      }
    });
  }
};

module.exports = barController;
