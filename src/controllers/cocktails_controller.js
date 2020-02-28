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
    return cocktail;
  },

  recupererLesCocktailsDuMoment: async () => {
    const cocktailsMoment = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      raw: true
    });
    console.log(cocktailsMoment.length);

    const randomInt = getRandomInteger(cocktailsMoment.length);
    console.log("chiffre aleatoire : ", randomInt);

    return cocktailsMoment[randomInt];
  }
};

module.exports = cocktailController;
