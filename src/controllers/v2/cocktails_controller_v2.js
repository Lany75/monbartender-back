const { Cocktail, Verre, Ingredient, EtapesPreparation } = require('../../models');
const Sequelize = require("sequelize");

const cocktailControllerV2 = {
  getAllCocktails: async () => {
    const cocktails = await Cocktail.findAll({
      order: [
        ['nom', 'ASC'],
        [{ model: Ingredient }, 'nom', 'ASC'],
        [{ model: EtapesPreparation }, 'numEtape', 'ASC'],

      ],
      attributes: ['id', 'nom', 'photo', 'alcool'],
      include: [
        {
          model: Verre,
          attributes: ['id', 'nom']
        },
        {
          model: Ingredient,
          attributes: ['id', 'nom'],
          through: { attributes: ['quantite', 'unite'] }
        },
        {
          model: EtapesPreparation,
          attributes: ["id", "numEtape", "texte"],
          through: { attributes: [] }
        }
      ]
    })

    return cocktails;
  },

  getAllNameCocktails: async name => {
    const cocktails = await Cocktail.findAll({
      where: {
        nom: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("Cocktail.nom")),
          "LIKE",
          "%" + name + "%"
        )
      },
      order: [
        ['nom', 'ASC'],
        [{ model: Ingredient }, 'nom', 'ASC'],
        [{ model: EtapesPreparation }, 'numEtape', 'ASC'],

      ],
      attributes: ['id', 'nom', 'photo', 'alcool'],
      include: [
        {
          model: Verre,
          attributes: ['id', 'nom']
        },
        {
          model: Ingredient,
          attributes: ['id', 'nom'],
          through: { attributes: ['quantite', 'unite'] }
        },
        {
          model: EtapesPreparation,
          attributes: ["id", "numEtape", "texte"],
          through: { attributes: [] }
        }
      ]
    })
    return cocktails;
  },

  getOneIdCocktail: async id => {
    const cocktail = await Cocktail.findByPk(id, {
      order: [
        ['nom', 'ASC'],
        [{ model: Ingredient }, 'nom', 'ASC'],
        [{ model: EtapesPreparation }, 'numEtape', 'ASC'],

      ],
      attributes: ['id', 'nom', 'photo', 'alcool'],
      include: [
        {
          model: Verre,
          attributes: ['id', 'nom']
        },
        {
          model: Ingredient,
          attributes: ['id', 'nom'],
          through: { attributes: ['quantite', 'unite'] }
        },
        {
          model: EtapesPreparation,
          attributes: ["id", "numEtape", "texte"],
          through: { attributes: [] }
        }
      ]
    })
    return cocktail;
  },

  glassIsUsed: async glassId => {
    const glass = await Cocktail.findOne({
      attributes: ['verreId'],
      where: { verreId: glassId }
    })

    if (glass) return true;
    else return false;
  }
}

module.exports = cocktailControllerV2;