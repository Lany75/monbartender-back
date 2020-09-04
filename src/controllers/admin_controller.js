const { Bar } = require("../models");

const adminController = {
  recupererLesAdmins: async () => {
    const admins = await Bar.findAll({
      where: { droits: true },
      attributes: ["personneId"]
    });

    return admins;
  },

  recupererLesUsers: async () => {
    const users = await Bar.findAll({
      //where: { droits: false },
      attributes: ["personneId"]
    });

    return users;
  },

  ajouterUnAdmin: async mail => {
    await Bar.update({ droits: true }, { where: { personneId: mail } });
    return true;
  },

  supprimerUnAdmin: async mail => {
    await Bar.update({ droits: false }, { where: { personneId: mail } });
    return true;
  }
};

module.exports = adminController;
