const { CocktailsMoment } = require("../../models");

const cocktailMomentControllerV2 = {
  getMomentCocktailIds: async () => {
    const cocktails = await CocktailsMoment.findAll({
      attributes: ["cocktailId"],
      raw: true
    });

    return cocktails;
  },
}


module.exports = cocktailMomentControllerV2;
