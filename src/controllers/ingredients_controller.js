const { Ingredient } = require("../models");

const ingredientController = {
  recupererLesIngredients: async () => {
    const ingredients = await Ingredient.findAll({
      order: [["nom", "ASC"]],
      attributes: ["nom"],
      raw: true
    });

    return ingredients;
  },

  /*recupererUnIngredient: async id => {
    const ingredient = await Ingredient.findByPk(id, {
      attributes: ["nom"]
    });
    return ingredient;
  },*/

  recupererIdIngredient: async nomIngredient => {
    //console.log("--------------------------------------------------");

    const idIngredient = await Ingredient.findOne({
      where: { nom: nomIngredient },
      attributes: ["id"]
    });
    //console.log("idIngredient : ", idIngredient[0].dataValues);

    return idIngredient;
  },

  recupererNomIngredient: async idIngredient => {
    const nomIngredient = await Ingredient.findOne({
      where: { id: idIngredient },
      attributes: ["nom"]
    });
  }
};

module.exports = ingredientController;
