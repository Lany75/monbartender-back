const {
  Cocktail,
  Verre,
  Ingredient,
  EtapesPreparation,
  CocktailsMoment
} = require("../models");
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
    //console.log(id);

    const cocktail = await Cocktail.findByPk(id, {
      attributes: ["nom", "photo"],
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

  recupererIdCocktail: async nom => {
    const idCocktail = await Cocktail.findOne({
      where: { nom: nom },
      attributes: ["id"]
    });

    return idCocktail.dataValues.id;
  },

  // fonction recupererIdCocktailsMoment = retourne tous les id de la table cocktails_moment
  recupererIdCocktailsMoment: async () => {
    const cocktails = await CocktailsMoment.findAll({
      attributes: ["cocktail_id"],
      raw: true
    });

    return cocktails;
  },

  //fonction recupererUnCocktailAleatoire = retourne un cocktail aléatoire à partir de tous les cocktails inclus dans la table cocktails
  recupererUnCocktailAleatoire: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      raw: true
    });

    const randomInt = getRandomInteger(cocktails.length);

    return cocktails[randomInt];
  }
};

module.exports = cocktailController;
