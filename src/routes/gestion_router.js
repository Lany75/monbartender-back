const express = require("express");
//const verifyToken = require("../middlewares/verify_token");
const isAuthenticated = require("../middlewares/is_authenticated");
const logger = require("../helpers/logger");

const {
  recupererIdCocktail,
  recupererUnCocktail,
  ajouterUnCocktail,
  recupererLesCocktails
} = require("../controllers/cocktails_controller");
const {
  recupererIdCocktailsMoment,
  modifierCocktailMoment
} = require("../controllers/cocktailsMoment_controller");

const {
  lierCocktailIngredient
} = require("../controllers/cocktailsIngredientsController");

const {
  ajouterEtapePreparation
} = require("../controllers/etapesPreparation_controller");

const {
  lierCocktailEtape
} = require("../controllers/cocktailsEtapes_controller");

const { recupererIdVerre } = require("../controllers/verres_controller");

const {
  recupererIdIngredient
} = require("../controllers/ingredients_controller");

const { OK, NOT_FOUND, CREATED } = require("../helpers/status_code");

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
          idCocktailsMoment[i].cocktailId
        );

        cocktailsMoment.push({
          id: idCocktailsMoment[i].cocktailId,
          nom: cocktail.dataValues.nom,
          photo: cocktail.dataValues.photo
        });
      }
    }

    response.status(OK);
    response.json(cocktailsMoment);
  }
);

gestionRouter.post("/cocktails", isAuthenticated, async (request, response) => {
  // console.log("on est dans l'ajout de cocktail");
  //console.log(request.body);
  const { nom, photo, verre, ingredients, etapes } = request.body;
  /*   console.log(nom);
  console.log(photo);
  console.log(verre);
  console.log(ingredients, ingredients.length);
  console.log(etapes); */

  logger.info(`Trying to get verre's id of ${verre}`);
  const idVerre = await recupererIdVerre(verre);

  logger.info(`Trying to add cocktail ${nom}`);
  const idCocktail = await ajouterUnCocktail(nom, photo, idVerre);

  for (let i = 0; i < ingredients.length; i++) {
    logger.info(`Trying to get ingredient's id of ${ingredients[i].nomIng}`);
    const idIngredient = await recupererIdIngredient(ingredients[i].nomIng);
    //console.log("id ingredient : ", idIngredient);

    logger.info(
      `Trying to bind cocktail ${nom} whith ingredient ${ingredients[i].nomIng}}`
    );
    await lierCocktailIngredient(
      idCocktail,
      idIngredient,
      ingredients[i].quantiteIng,
      ingredients[i].uniteIng
    );
  }

  for (let e = 0; e < etapes.length; e++) {
    logger.info(`Trying to add etape ${e + 1}`);
    const idEtape = await ajouterEtapePreparation(1, etapes[e]);
    console.log("id etape: ", idEtape);

    logger.info(`Trying to bind cocktail ${nom} whith etape ${e + 1}}`);
    await lierCocktailEtape(idCocktail, idEtape);
  }

  const cocktails = await recupererLesCocktails();
  //console.log(cocktails);

  response.status(CREATED);
  response.json(cocktails);
});

module.exports = gestionRouter;
