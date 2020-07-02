const { Verre } = require("../models");

const verreController = {
  recupererLesVerres: async () => {
    const verres = await Verre.findAll({
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
  }
};

module.exports = verreController;
