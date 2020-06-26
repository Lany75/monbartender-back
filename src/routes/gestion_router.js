const express = require("express");
//const verifyToken = require("../middlewares/verify_token");
const isAuthenticated = require("../middlewares/is_authenticated");
const logger = require("../helpers/logger");

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
  isAuthenticated,
  async (request, response) => {
    const nomAncienCocktail = request.query.nomAncienCocktail;
    const nomNouveauCocktail = request.query.nomNouveauCocktail;

    logger.info(`Trying to get cocktail's id of ${nomAncienCocktail}`);
    const idAncienCocktail = await recupererIdCocktail(nomAncienCocktail);
    logger.info(`Trying to get cocktail's id of ${nomNouveauCocktail}`);
    const idNouveauCocktail = await recupererIdCocktail(nomNouveauCocktail);

    logger.info(`Trying to change cocktail of the day`);
    await modifierCocktailMoment(idAncienCocktail, idNouveauCocktail);

    const cocktailsMoment = [];

    logger.info(`Trying to get new cocktail of the day id`);
    const idCocktailsMoment = await recupererIdCocktailsMoment();

    if (!idCocktailsMoment) {
      logger.info(`New cocktails of the day not found`);
      response
        .status(NOT_FOUND)
        .json("La liste de cocktail n'a pas été récupérée");
    } else {
      logger.info(`New cocktails of the day found`);
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

gestionRouter.post("/cocktails", async (request, response) => {
  console.log("on est dans l'ajout de cocktail");
  console.log(request.body);

  for (let i = 0; i < request.body.ingredients.length; i++) {
    console.log(request.body.ingredients[0]);
  }

  /* console.log(request.body.nom);
  console.log(request.body.photo);
  console.log(request.body.verre);
  console.log(request.body.ingredients.nomIng);
  console.log(request.body.ingredients.quantiteIng);
  console.log(request.body.ingredients.uniteIng);
  console.log(request.body.etapes); */

  response.status(OK);
  response.json(request.body);
});

module.exports = gestionRouter;
