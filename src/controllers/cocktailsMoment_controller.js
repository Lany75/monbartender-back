const { CocktailsMoment } = require("../models");

const cocktailMomentController = {
  // fonction recupererIdCocktailsMoment = retourne tous les id de la table cocktails_moment
  recupererIdCocktailsMoment: async () => {
    const cocktails = await CocktailsMoment.findAll({
      attributes: ["cocktailId"],
      raw: true
    });

    return cocktails;
  },

  modifierCocktailMoment: async (ancienCocktail, nouveauCocktail) => {
    await CocktailsMoment.update(
      { cocktailId: nouveauCocktail },
      { where: { cocktailId: ancienCocktail } }
    );
    return true;
  }
};

module.exports = cocktailMomentController;
