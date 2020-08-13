const { CocktailIngredient } = require("../models");

const cocktailIngredientController = {
  recupererQuantiteIngredient: async cocktailId => {
    const quantiteIngredient = await CocktailIngredient.findAll({
      where: { cocktailId: cocktailId },
      attributes: ["ingredientId", "quantite", "unite"]
    });

    return quantiteIngredient;
  },

  lierCocktailIngredient: async (idCocktail, idIngredient, quantite, unite) => {
    if (quantite === "" || unite === "") {
      await CocktailIngredient.create({
        cocktailId: idCocktail,
        ingredientId: idIngredient
      });
    } else {
      await CocktailIngredient.create({
        cocktailId: idCocktail,
        ingredientId: idIngredient,
        quantite: quantite,
        unite: unite
      });
    }
  },

  supprimerCocktailIngredient: async idCocktail => {
    await CocktailIngredient.destroy({
      where: { cocktailId: idCocktail }
    });
  },

  verificationIngredientUtil: async ingredientId => {
    const cocktail = await CocktailIngredient.findOne({
      where: { ingredientId: ingredientId },
      attributes: ["cocktailId"]
    });

    if (cocktail) return true;
    else return false;
  },

  recupererIngredientsCocktails: async () => {
    const ingredientsCocktails = await CocktailIngredient.findAll({
      attributes: ["cocktailId", "ingredientId", "quantite", "unite"],
      raw: true
    });

    return ingredientsCocktails;
  }
};

module.exports = cocktailIngredientController;
