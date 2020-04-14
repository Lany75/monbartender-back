const { Verre } = require("../models");

const verreController = {
  recupererLesVerres: async () => {
    const verres = await Verre.findAll({
      attributes: ["id", "nom"],
      raw: true
    });
    return verres;
  }
};

module.exports = verreController;
