const { BarIngredient } = require("../models");

const barIngredientController = {
  // fonction ajouterUnIngredientAuBar = ajoute un ingrédient à la table bars_ingredients (modèle BarIngredient)
  // grâce à l'id du bar et à l'id de l'ingrédient
  // pas de valeur retournée
  ajouterUnIngredientAuBar: async (ingredientId, userId) => {
    await BarIngredient.create({
      barId: userId,
      ingredientId: ingredientId
    });
  },

  // fonction supprimerUnIngredientDuBar = supprimer un ingrédient à la table bars_ingredients (modèle BarIngredient)
  // grâce à l'id du bar et à l'id de l'ingrédient
  // pas de valeur retournée
  supprimerUnIngredientDuBar: async (ingredientId, userId) => {
    await BarIngredient.destroy({
      where: {
        barId: userId,
        ingredientId: ingredientId
      }
    });
  },

  estDansLeBar: async (userId, ingredientId) => {
    const exist = await BarIngredient.findOne({
      where: {
        barId: userId,
        ingredientId: ingredientId
      }
    });

    if (!exist) return false;
    else return true;
  }
};

module.exports = barIngredientController;
