const { Ingredient } = require("../models");

const ingredientController = {
  recupererUnIngredient: async id => {
    const ingredient = await Ingredient.findByPk(id, {
      attributes: ["nom"]
    });
    return ingredient;
  },

  recupererIdIngredient: async nomIngredient => {
    console.log("--------------------------------------------------");

    const idIngredient = await Ingredient.findAll({
      where: { nom: nomIngredient },
      attributes: ["id"]
    });

    return idIngredient;
  }
};

module.exports = ingredientController;
