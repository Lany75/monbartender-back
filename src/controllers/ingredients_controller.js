const { Ingredient } = require("../models");
const uuid = require("uuid");

const ingredientController = {
  //fonction recupererLesIngredients = retourne un tableau de tous les ingrédients de la table ingredients (modele Ingredient)
  recupererLesIngredients: async () => {
    const ingredients = await Ingredient.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom"],
      raw: true
    });

    return ingredients;
  },

  //fonction recupererIdIngredient = retourne l'id de l'ingrédient trouvé dans la table ingredients (modèle Ingredient)
  // à partir de son nom
  recupererIdIngredient: async nomIngredient => {
    if (nomIngredient === "") return null;
    const idIngredient = await Ingredient.findOne({
      where: { nom: nomIngredient },
      attributes: ["id"]
    });
    if (!idIngredient) return null;
    else return idIngredient.dataValues.id;
  },

  //fonction recupererNomIngredient = retourne le nom de l'ingrédient trouvé dans la table ingredients (modèle Ingredient)
  // à partir de son id
  recupererNomIngredient: async idIngredient => {
    const nomIngredient = await Ingredient.findOne({
      where: { id: idIngredient },
      attributes: ["nom"]
    });
    return nomIngredient.dataValues.nom;
  },

  ajouterIngredientsDB: async nomIngredient => {
    await Ingredient.create({
      id: uuid(),
      nom: nomIngredient
    });
  },

  ingredientExistant: async nomIngredient => {
    const exist = await Ingredient.findOne({
      where: { nom: nomIngredient }
    });

    if (!exist) return false;
    else return true;
  },

  supprimerUnIngredient: async ingredientId => {
    await Ingredient.destroy({
      where: {
        id: ingredientId
      }
    });
  }
};

module.exports = ingredientController;
