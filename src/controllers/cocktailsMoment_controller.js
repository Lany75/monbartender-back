const { CocktailsMoment } = require("../models");
const uuid = require("uuid");

const cocktailMomentController = {
  // fonction recupererIdCocktailsMoment = retourne tous les id de la table cocktails_moment
  recupererIdCocktailsMoment: async () => {
    const cocktails = await CocktailsMoment.findAll({
      attributes: ["cocktailId"],
      raw: true
    });

    return cocktails;
  },

  modifierCocktailMoment: async (idCocktail1, idCocktail2) => {
    await CocktailsMoment.destroy({ where: {} });
    await CocktailsMoment.create({
      id: uuid(),
      cocktailId: idCocktail1
    });
    await CocktailsMoment.create({
      id: uuid(),
      cocktailId: idCocktail2
    });
    return true;
  }
};

module.exports = cocktailMomentController;
