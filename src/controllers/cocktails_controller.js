const { Cocktail, Verre, Ingredient } = require("../models");

const cocktailController = {
  recupererLesCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom", "photo"],
      raw: true
    });
    return cocktails;
  },

  recupererUnCocktail: async id => {
    const cocktail = await Cocktail.findByPk(id, {
      attributes: ["nom", "photo", "etapesPreparation"],
      include: [
        {
          model: Verre,
          attributes: ["nom"]
        }
        /*,
        {
          model: Ingredient,
          attributes: ["nom"],
          through: { attributes: [] }
        }*/
      ]
    });

    /*const verre = await Verre.findByPk(cocktail.verreId, {
      attributes: ["nom"],
      raw: true
    });*/

    /*   const nomCocktail = cocktail.nom;
    const { photo, etapesPreparation } = cocktail;
    const nomVerre = verre.nom;

    const resultat = {
      nomCocktail,
      photo,
      nomVerre,
      etapesPreparation
    };
*/

    /*  const resultat = {
      nomCocktail: cocktail.nom,
      photo : cocktail.photo,
      nomVerre: verre.nom,
      etapePreparation: cocktail.etapesPreparation
    };*/

    /*const cocktail = await Cocktail.findOne({
      where: { id: id },
      include: [{ model: Verre }]
    });*/

    return cocktail;
  }
};

module.exports = cocktailController;
