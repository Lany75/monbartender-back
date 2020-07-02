const { Bar, Ingredient, BarIngredient } = require("../models");
const uuid = require("uuid");

const barController = {
  //fonction recupererUnBars = retourne le bar trouvé dans la table bars (modele Bar) à partir du mail
  recupererUnBar: async mail => {
    const bar = await Bar.findOne({
      where: { personneId: mail },
      attributes: ["id", "personneId", "droits"],
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
      where: { personneId: mail },
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
  }
};

module.exports = barController;
