const uuid = require("uuid");
const { Unite } = require('../../models');

const unitiesControllerV2 = {
  getAllUnities: async () => {
    const unities = await Unite.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom"],
      raw: true
    })

    return unities;
  },

  getIdUnity: async unityName => {
    const unityId = await Unite.findOne({
      attributes: ['id'],
      where: { nom: unityName }
    })

    return unityId?.dataValues.id;
  },

  getNameOfUnity: async unityId => {
    const unityName = await Unite.findOne({
      attributes: ['nom'],
      where: { id: unityId }
    })

    return unityName?.dataValues.nom;
  },

  addUnity: async unityName => {
    await Unite.create({
      id: uuid(),
      nom: unityName
    })
  },

  unityIdIsExisting: async unityId => {
    const unity = await Unite.findOne({
      attributes: ['id'],
      where: { id: unityId }
    })

    if (unity) return true;
    else return false;
  },

  deleteUnity: unityId => {
    return Unite.destroy({
      where: {
        id: unityId
      }
    })
  },
}

module.exports = unitiesControllerV2;