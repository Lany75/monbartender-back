const { Verre, Cocktail } = require("../models");
const cocktailMomentController = require("./cocktailsMoment_controller");

const verreController = {
  recupererLesVerres: async () => {
    const verres = await Verre.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom"],
      raw: true
    });
    return verres;
  },

  recupererUnVerre: async idVerre => {
    const verre = await Verre.findOne({
      where: { id: idVerre },
      attributes: ["id", "nom"]
    });

    return verre;
  },

  recupererIdVerre: async nomVerre => {
    if (nomVerre === "") return null;
    const idVerre = await Verre.findOne({
      where: { nom: nomVerre },
      attributes: ["id"]
    });
    if (!idVerre) return null;
    else return idVerre.dataValues.id;
  },

  verreExistant: async nomVerre => {
    const exist = await Verre.findOne({
      where: { nom: nomVerre }
    });

    if (!exist) return false;
    else return true;
  },

  ajouterVerresDB: async verres => {
    await Verre.bulkCreate(verres);
  },

  supprimerUnVerre: async verreId => {
    await Verre.destroy({
      where: {
        id: verreId
      }
    });
  },

  verificationVerreUtil: async verreId => {
    const cocktail = await Cocktail.findOne({
      where: { verreId: verreId },
      attributes: ["nom"]
    });

    if (cocktail) return true;
    else return false;
  }
};

module.exports = verreController;
