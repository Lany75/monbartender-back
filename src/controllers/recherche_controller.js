const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Cocktail } = require("../models/");

const rechercheController = {
  rechercherUnCocktailParSonNom: async nom => {
    console.log("nom", nom);
    const cocktail = await Cocktail.findAll({
      where: {
        nom: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("nom")),
          "LIKE",
          "%" + nom + "%"
        )
      },
      //where: { nom: { [Op.like]: "%" + nom + "%" } },
      attributes: ["id", "nom", "photo"]
    });
    return cocktail;
  }
};

module.exports = rechercheController;
