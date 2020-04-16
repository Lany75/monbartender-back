const { CocktailsMoment } = require("../models");
const uuid = require("uuid");

const gestionController = {
  modifierCocktailMoment: async (ancienCocktail, nouveauCocktail) => {
    // console.log("on est dans modifierCocktailMoment");

    // console.log("ancienCocktail : ", ancienCocktail);
    // console.log("nouveauCocktail : ", nouveauCocktail);

    await CocktailsMoment.update(
      { cocktailId: nouveauCocktail },
      { where: { cocktailId: ancienCocktail } }
    );
    return true;

    /* await CocktailsMoment.destroy({
      where: {
        cocktail_id: ancienCocktail
      }
    });
    await CocktailsMoment.create({
      id: uuid(),
      cocktailId: nouveauCocktail
    }); */
  }
};

module.exports = gestionController;
