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

  addUnity: async unityName => {
    await Unite.create({
      id: uuid(),
      nom: unityName
    })
  },
}

module.exports = unitiesControllerV2;