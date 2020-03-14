const { Cocktail, Verre, Ingredient } = require("../models");
require("express-async-errors");

const NotFoundError = require("../helpers/errors/404_not_found");

const getRandomInteger = require("../utils/getRandomInteger");

const cocktailController = {
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      raw: true
    });

    //  if (!cocktails) throw new NotFoundError("court", "long");

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

    // if (!cocktail) throw new NotFoundError("court", "long");

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
