const { Verre } = require("../models");

const verreController = {
  recupererLesVerres: async () => {
    const verres = await Verre.findAll({
      order: [["nom", "ASC"]],
      attributes: ["id", "nom"],
      raw: true
    });
    return verres;
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

  isVerre: async nomVerre => {
    const exist = await Verre.findOne({
      where: { nom: nomVerre }
    });

    if (!exist) return false;
    else return true;
  },

  ajouterVerresDB: async verres => {
    await Verre.bulkCreate(verres);
  }
};

module.exports = verreController;
