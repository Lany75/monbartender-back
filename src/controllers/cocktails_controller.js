const { Cocktail, Verre, Ingredient } = require("../models");

const getRandomInteger = require("../utils/getRandomInteger");

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
    //if !cocktail
    // throw new NotFoundError("court", "long")
    return cocktail;
  },

  recupererLesCocktailsDuMoment: async () => {
    const cocktailsMoment = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      raw: true
    });

    const randomInt = getRandomInteger(cocktailsMoment.length);

    return cocktailsMoment[randomInt];
  }
};

module.exports = cocktailController;
