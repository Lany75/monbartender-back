const { Cocktail, Verre, Ingredient, EtapesPreparation } = require("../models");
require("express-async-errors");

const NotFoundError = require("../helpers/errors/404_not_found");

const getRandomInteger = require("../utils/getRandomInteger");

const cocktailController = {
  // fonction recupererLesCocktails = retourne un tableau de tous les cocktails de la table cocktails (modèle Cocktail)
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo", "verre_id", "etapes_preparation_id"],
      raw: true
    });

    //  if (!cocktails) throw new NotFoundError("court", "long");

    return cocktails;
  },

  // fonction recupererUnCocktail = retourne le cocktail trouvé dans la table cocktails (modele Cocktail)
  // grâce à l'id passé en paramètre
  recupererUnCocktail: async id => {
    const cocktail = await Cocktail.findByPk(id, {
      attributes: ["nom", "photo", "etapesPreparation"],
      include: [
        {
          model: Verre,
          attributes: ["id", "nom"]
        },
        {
          model: Ingredient,
          attributes: ["id", "nom"],
          through: { attributes: [] }
        },
        {
          model: EtapesPreparation,
          attributes: [
            "id",
            "etape1",
            "etape2",
            "etape3",
            "etape4",
            "etape5",
            "etape6"
          ]
        }
      ]
    });

    // if (!cocktail) throw new NotFoundError("court", "long");

    return cocktail;
  },

  //fonction recupererLesCocktailsDuMoment = retourne un cocktail aléatoire à partir de tous les cocktails inclus dans la table cocktails
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
