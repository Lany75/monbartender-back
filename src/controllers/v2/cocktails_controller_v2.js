const { Cocktail, Verre, Ingredient, EtapesPreparation } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuid = require("uuid");

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
          attributes: ['id', 'numEtape', 'texte']
        }
      ]
    })

    return cocktails;
  },

  getAllNameCocktails: async name => {
    const cocktails = await Cocktail.findAll({
      where: {
        nom: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('Cocktail.nom')),
          'LIKE',
          '%' + name + '%'
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
          attributes: ['id', 'numEtape', 'texte']
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
          attributes: ['id', 'numEtape', 'texte']
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
  },

  searchCocktail: async (ingredients, typeCocktail) => {
    let whereCondition = { alcool: typeCocktail };
    if (typeCocktail === 'indifferent') {
      whereCondition = null;
    }

    const cocktails = await Cocktail.findAll({
      order: [
        ['nom', 'ASC'],
        [{ model: Ingredient }, 'nom', 'ASC'],
        [{ model: EtapesPreparation }, 'numEtape', 'ASC'],

      ],
      attributes: ['id', 'nom', 'photo', 'alcool'],
      where: whereCondition,
      include: [
        {
          model: Verre,
          attributes: ['id', 'nom']
        },
        {
          model: Ingredient,
          attributes: ['id', 'nom'],
          through: { attributes: ['quantite', 'unite'] },
          where: {
            nom: { [Op.any]: ingredients }
          }
        },
        {
          model: EtapesPreparation,
          attributes: ['id', 'numEtape', 'texte'],
        }
      ]
    })

    return cocktails;
  },

  postCocktail: async (nom, photo, idVerre, type) => {
    const cocktail = await Cocktail.create({
      id: uuid(),
      nom: nom,
      photo: photo,
      verreId: idVerre,
      alcool: type
    });
    return cocktail.id;
  },

  cocktailIdIsExisting: async cocktailId => {
    const cocktail = await Cocktail.findOne({
      attributes: ['id'],
      where: { id: cocktailId }
    })

    if (cocktail) return true;
    else return false;
  },

  deleteCocktail: async cocktailId => {
    await Cocktail.destroy({
      where: {
        id: cocktailId
      }
    })
  },

  getCocktailImage: async cocktailId => {
    const photo = await Cocktail.findOne({
      attributes: ['photo'],
      where: { id: cocktailId }
    })

    return photo.dataValues.photo;
  }
}

module.exports = cocktailControllerV2;