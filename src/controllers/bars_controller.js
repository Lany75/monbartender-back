const { Bar, Ingredient } = require("../models");

const barController = {
  recupererLesBars: async () => {
    const bars = await Bar.findAll({
      attributes: ["id", "personne_id"],
      raw: true
    });
    return bars;
  },

  recupererUnBar: async mail => {
    const bar = await Bar.findAll({
      where: { personne_id: mail },
      //   const bar = await Bar.findByPk(id, {
      attributes: ["personne_id"],
      include: [
        {
          model: Ingredient,
          attributes: ["nom"],
          through: { attributes: [] }
        }
      ]
    });
    return bar;
  },

  ajouterUnIngredient: async (request, response) => {
    console.log("on veut ajouter un ingredient");
    //console.log("request.body.ingredient", request.body.ingredient);
    const nouvelIngredient = [{ nom: "toto" }];
    return nouvelIngredient;
  },

  supprimerUnIngredientDuBar: async name => {
    console.log("on supprimer l'ingredient", name);
  }
};

module.exports = barController;
