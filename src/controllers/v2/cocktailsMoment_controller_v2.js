const { CocktailsMoment } = require("../../models");

const cocktailMomentControllerV2 = {
  getMomentCocktailIds: async () => {
    const cocktails = await CocktailsMoment.findAll({
      attributes: ["cocktailId"],
      raw: true
    });

    return cocktails;
  },

  cocktailIsMomentCocktail: async cocktailId => {
    const cocktail = await CocktailsMoment.findOne({
      attributes: ['id'],
      where: { cocktailId: cocktailId }
    })

    if (cocktail) return true;
    else return false;
  }
}


module.exports = cocktailMomentControllerV2;
