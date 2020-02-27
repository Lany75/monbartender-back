const { Cocktail } = require("../models");

const cocktailController = {
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["nom", "photo"],
      raw: true
    });
    return cocktails;
  }
};

module.exports = cocktailController;
