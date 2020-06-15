const { Bar, Ingredient, BarIngredient } = require("../models");
const uuid = require("uuid");

const barController = {
  //fonction recupererLesBars = retourne un tableau de tous les bars de la table bars (modele Bar)
  recupererLesBars: async () => {
    const bars = await Bar.findAll({
      attributes: ["id", "personne_id"],
      raw: true
    });
    return bars;
  },

  //fonction recupererUnBars = retourne le bar trouvé dans la table bars (modele Bar) à partir du mail
  recupererUnBar: async mail => {
    const bar = await Bar.findOne({
      where: { personne_id: mail },
      attributes: ["id", "personne_id", "droits"],
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

  //fonction recupererIdBar = retourne l'id du bar trouvé dans la table bars (modèle Bar) à partir de son mail
  recupererIdBar: async mail => {
    const barId = await Bar.findOne({
      where: { personne_id: mail },
      attributes: ["id"]
    });
    if (!barId) return null;
    else return barId.dataValues.id;
  },

  //fonction CreerUnBar = crée le bar de l'utilisateur grâce à son mail
  // pas de valeur retournée
  creerUnBar: async mail => {
    await Bar.create({
      id: uuid(),
      personneId: mail,
      droits: false
    });
  },

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
        bar_id: userId,
        ingredient_id: ingredientId
      }
    });
  },

  estDansLeBar: async (userId, ingredientId) => {
    const exist = await BarIngredient.findOne({
      where: {
        bar_id: userId,
        ingredient_id: ingredientId
      }
    });

    if (!exist) return false;
    else return true;
  }
};

module.exports = barController;
