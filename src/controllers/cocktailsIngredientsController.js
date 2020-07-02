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
    await CocktailIngredient.create({
      cocktailId: idCocktail,
      ingredientId: idIngredient,
      quantite: quantite,
      unite: unite
    });
  },

  supprimerCocktailIngredient: async idCocktail => {
    await CocktailIngredient.destroy({
      where: { cocktailId: idCocktail }
    });
  }
};

module.exports = cocktailIngredientController;
