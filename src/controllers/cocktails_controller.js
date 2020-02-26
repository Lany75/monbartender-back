const { Cocktail } = require("../models");

const cocktailController = {
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "etapesPreparation"],
      raw: true
    });
    return cocktails;
  }
};

module.exports = cocktailController;
