const { Cocktail, Verre, Ingredient } = require("../models");

const cocktailController = {
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      raw: true
    });
    return cocktails;
  },

  recupererUnCocktail: async id => {
    const cocktail = await Cocktail.findByPk(id, {
      attributes: ["nom", "photo", "etapesPreparation"],
      include: [
        {
          model: Verre,
          attributes: ["nom"]
        },
        {
          model: Ingredient,
          attributes: ["nom"],
          through: { attributes: [] }
        }
      ]
    });
    return cocktail;
  }
};

module.exports = cocktailController;
