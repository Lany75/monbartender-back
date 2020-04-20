const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const {
  recupererIdCocktail,
  recupererIdCocktailsMoment,
  recupererUnCocktail
} = require("../controllers/cocktails_controller");

const { modifierCocktailMoment } = require("../controllers/gestion_controller");

const { OK, NOT_FOUND } = require("../helpers/status_code");

const gestionRouter = express.Router();

gestionRouter.put(
  "/cocktails-du-moment",
  verifyToken,
  async (request, response) => {
    const nomAncienCocktail = request.query.nomAncienCocktail;
    const nomNouveauCocktail = request.query.nomNouveauCocktail;

    const idAncienCocktail = await recupererIdCocktail(nomAncienCocktail);
    const idNouveauCocktail = await recupererIdCocktail(nomNouveauCocktail);

    await modifierCocktailMoment(idAncienCocktail, idNouveauCocktail);

    const cocktailsMoment = [];

    const idCocktailsMoment = await recupererIdCocktailsMoment();

    if (!idCocktailsMoment) {
      response
        .status(NOT_FOUND)
        .json("La liste de cocktail n'a pas été récupérée");
    } else {
      for (let i = 0; i < idCocktailsMoment.length; i++) {
        const cocktail = await recupererUnCocktail(
          idCocktailsMoment[i].cocktail_id
        );

        cocktailsMoment.push({
          id: idCocktailsMoment[i].cocktail_id,
          nom: cocktail.dataValues.nom,
          photo: cocktail.dataValues.photo
        });
      }
    }

    response.status(OK);
    response.json(cocktailsMoment);
  }
);

module.exports = gestionRouter;
