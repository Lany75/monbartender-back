const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Cocktail, CocktailIngredient } = require("../models/");

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
      //where: { nom: { [Op.like]: "%" + nom + "%" } },
      attributes: ["id", "nom", "photo"]
    });
    return cocktail;
  },

  //fonction rechercherCocktailsParIngredients = retourne un tableau de tous les cocktails de la table cocktails (modele Cocktail)
  //comportant le nom passé en paramètre
  rechercherCocktailsParIngredients: async idIng => {
    const idCocktails = await CocktailIngredient.findAll({
      where: {
        ingredientId: idIng
      },
      attributes: ["cocktailId"]
    });
    return idCocktails;
  }
};

module.exports = rechercheController;
