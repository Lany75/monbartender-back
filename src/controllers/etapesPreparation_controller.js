const uuid = require("uuid");

const { EtapesPreparation } = require("../models");

const etapePreparationController = {
  ajouterEtapePreparation: async (numEtape, texte) => {
    const etape = await EtapesPreparation.create({
      id: uuid(),
      numEtape: numEtape,
      texte: texte
    });
    return etape.id;
  },

  supprimerEtapePreparation: async etapeId => {
    await EtapesPreparation.destroy({
      where: { id: etapeId }
    });
  }
};

module.exports = etapePreparationController;
