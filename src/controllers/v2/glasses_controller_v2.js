const uuid = require("uuid");
const { Verre } = require('../../models');

const glassesControllerV2 = {
  getAllGlasses: async () => {
    const glasses = await Verre.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom"],
    })

    return glasses;
  },

  getIdGlass: async glassName => {
    const glassId = await Verre.findOne({
      attributes: ['id'],
      where: { nom: glassName }
    })

    return glassId?.dataValues.id;
  },

  addGlass: async glassName => {
    await Verre.create({
      id: uuid(),
      nom: glassName
    })
  },

  glassIdIsExisting: async glassId => {
    const glass = await Verre.findOne({
      attributes: ['id'],
      where: { id: glassId }
    })

    if (glass) return true;
    else return false;
  },

  deleteGlass: async glassId => {
    await Verre.destroy({
      where: {
        id: glassId
      }
    })
  },

  getNamedGlass: async glassName => {
    const glass = await Verre.findOne({
      attributes: ['id', 'nom'],
      where: { nom: glassName }
    })

    return glass?.dataValues;
  },

  putOneGlass: async (glassId, glassName) => {
    await Verre.update(
      {
        nom: glassName
      },
      {
        where: { id: glassId }
      }
    )
  }
}

module.exports = glassesControllerV2;