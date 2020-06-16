const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Cocktail, Ingredient } = require("../models/");

const rechercheController = {
  //fonction rechercherUnCocktailParSonNom = retourne un tableau de tous les cocktails de la table cocktails (modele Cocktail)
  //comportant le nom passé en paramètre
  rechercherUnCocktailParSonNom: async nom => {
    const cocktail = await Cocktail.findAll({
      where: {
        nom: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("nom")),
          "LIKE",
          "%" + nom + "%"
        )
      },
      attributes: ["id", "nom", "photo"]
    });
    return cocktail;
  },

  //fonction rechercherCocktailsParIngredients = retourne un tableau de tous les cocktails de la table cocktails (modele Cocktail)
  //comportant le nom passé en paramètre
  rechercherCocktailsParIngredients: async ingredients => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      include: [
        {
          model: Ingredient,
          where: {
            nom: {
              [Op.any]: ingredients
            }
          }
        }
      ]
    });

    return cocktails;
  }
};

module.exports = rechercheController;
