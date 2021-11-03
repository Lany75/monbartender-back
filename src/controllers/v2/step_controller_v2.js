const { EtapesPreparation } = require("../../models");

const stepControllerV2 = {
  addStep: async (idEtape, numEtape, libelle, cocktailId) => {
    const etape = await EtapesPreparation.create({
      id: idEtape,
      numEtape: numEtape,
      texte: libelle,
      cocktailId: cocktailId
    });
    return etape.id;
  }
}

module.exports = stepControllerV2;
