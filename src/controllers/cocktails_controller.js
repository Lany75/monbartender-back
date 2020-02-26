const { Cocktail } = require("../models");

const cocktailController = {
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo", "etapesPreparation"],
      raw: true
    });
    return cocktails;
  }
};

module.exports = cocktailController;
