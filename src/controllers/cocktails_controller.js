const { Cocktail, Verre, Ingredient, EtapesPreparation } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
require("express-async-errors");
const uuid = require("uuid");

const getRandomInteger = require("../utils/getRandomInteger");

const cocktailsRouter = require("../routes/cocktails_router");

const cocktailController = {
  // fonction recupererLesCocktails = retourne un tableau de tous les cocktails de la table cocktails (modèle Cocktail)
  recupererLesCocktails: async alcool => {
    let cocktails;
    if (alcool === "indifferent") {
      cocktails = await Cocktail.findAll({
        order: [["nom", "ASC"]],
        attributes: ["id", "nom", "photo", "verreId", "alcool"],
        raw: true
      });
    } else {
      cocktails = await Cocktail.findAll({
        where: { alcool: alcool },
        order: [["nom", "ASC"]],
        attributes: ["id", "nom", "photo", "verreId", "alcool"],
        raw: true
      });
    }

    return cocktails;
  },

  // fonction recupererUnCocktail = retourne le cocktail trouvé dans la table cocktails (modele Cocktail)
  // grâce à l'id passé en paramètre
  recupererUnCocktail: async id => {
    const cocktail = await Cocktail.findByPk(id, {
      attributes: ["id", "nom", "photo"],
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
          attributes: ["id", "numEtape", "texte"],
          through: { attributes: [] }
        }
      ]
    });

    return cocktail;
  },

  recupererIdCocktail: async nom => {
    const idCocktail = await Cocktail.findOne({
      where: { nom: nom },
      attributes: ["id"]
    });

    return idCocktail.dataValues.id;
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
  },

  //fonction rechercherUnCocktailParSonNom = retourne un tableau de tous les cocktails de la table cocktails (modele Cocktail)
  //comportant le nom passé en paramètre
  rechercherUnCocktailParSonNom: async nom => {
    const cocktails = await Cocktail.findAll({
      where: {
        nom: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("nom")),
          "LIKE",
          "%" + nom + "%"
        )
      },
      attributes: ["id", "nom", "photo"]
    });
    return cocktails;
  },

  //fonction rechercherCocktailsParIngredients = retourne un tableau de tous les cocktails de la table cocktails (modele Cocktail)
  //comportant le nom passé en paramètre
  rechercherCocktailsParIngredients: async (ingredients, alcool) => {
    let cocktails;
    if (alcool === "indifferent") {
      cocktails = await Cocktail.findAll({
        order: [["nom", "ASC"]],
        attributes: ["id", "nom", "photo"],
        include: [
          {
            model: Ingredient,
            where: {
              nom: { [Op.any]: ingredients }
            }
          }
        ]
      });
    } else {
      cocktails = await Cocktail.findAll({
        where: { alcool: alcool },
        order: [["nom", "ASC"]],
        attributes: ["id", "nom", "photo"],
        include: [
          {
            model: Ingredient,
            where: {
              nom: { [Op.any]: ingredients }
            }
          }
        ]
      });
    }

    return cocktails;
  },

  ajouterUnCocktail: async (nom, photo, idVerre, alcoolise) => {
    const cocktail = await Cocktail.create({
      id: uuid(),
      nom: nom,
      photo: photo,
      verreId: idVerre,
      alcool: alcoolise
    });
    return cocktail.id;
  },

  supprimerUnCocktail: async cocktailId => {
    await Cocktail.destroy({
      where: {
        id: cocktailId
      }
    });
  }
};

module.exports = cocktailController;
