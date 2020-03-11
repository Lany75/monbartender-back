const { Bar, Ingredient, BarIngredient } = require("../models");
const uuid = require("uuid");

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
      attributes: ["id", "personne_id"],
      include: [
        {
          model: Ingredient,
          attributes: ["nom"],
          through: { attributes: [] }
        }
      ]
    });
    //console.log("bar", bar);
    return bar;
  },

  recupererIdBar: async mail => {
    const barId = await Bar.findAll({
      where: { personne_id: mail },
      attributes: ["id"]
    });
    //console.log("barId : ", barId);
    return barId;
  },

  creerUnBar: async mail => {
    await Bar.create({
      id: uuid(),
      personneId: mail
    });
  },

  ajouterUnIngredient: async (ingredientId, userId) => {
    console.log("on veut ajouter un ingredient");
    console.log("userId : ", userId);
    console.log("ingredientId : ", ingredientId);

    await BarIngredient.create({
      barId: userId,
      ingredientId: ingredientId
    });
  },

  supprimerUnIngredientDuBar: async name => {
    console.log("on supprimer l'ingredient", name);
  }
};

module.exports = barController;
