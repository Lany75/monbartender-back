const { CocktailEtape } = require("../models");

const cocktailEtapeController = {
  lierCocktailEtape: async (cocktailId, etapeId) => {
    await CocktailEtape.create({
      cocktailId: cocktailId,
      etapeId: etapeId
    });
  },

  recupererEtapesId: async cocktailId => {
    const idEtapes = await CocktailEtape.findAll({
      where: { cocktailId: cocktailId },
      attributes: ["etapeId"]
    });

    return idEtapes;
  },

  supprimerCocktailEtape: async cocktailId => {
    await CocktailEtape.destroy({
      where: { cocktailId: cocktailId }
    });
  }
};

module.exports = cocktailEtapeController;
