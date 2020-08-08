const express = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");
const logger = require("../helpers/logger");

const {
  recupererIdCocktail,
  recupererUnCocktail,
  ajouterUnCocktail,
  recupererLesCocktails,
  supprimerUnCocktail,
  modifierNomCocktail,
  modifierPhotoCocktail
} = require("../controllers/cocktails_controller");
const {
  recupererIdCocktailsMoment,
  modifierCocktailMoment
} = require("../controllers/cocktailsMoment_controller");

const {
  lierCocktailIngredient,
  supprimerCocktailIngredient
} = require("../controllers/cocktailsIngredients_controller");

const {
  ajouterEtapePreparation,
  supprimerEtapePreparation
} = require("../controllers/etapesPreparation_controller");

const {
  lierCocktailEtape,
  recupererEtapesId,
  supprimerCocktailEtape
} = require("../controllers/cocktailsEtapes_controller");

const {
  recupererIdVerre,
  verreExistant,
  ajouterVerresDB,
  recupererLesVerres,
  supprimerUnVerre,
  verificationVerreUtil
} = require("../controllers/verres_controller");

const {
  recupererIdIngredient,
  recupererLesIngredients,
  ajouterIngredientsDB,
  isIngredient
} = require("../controllers/ingredients_controller");

const {
  OK,
  NOT_FOUND,
  CREATED,
  BAD_REQUEST,
  FORBIDDEN
} = require("../helpers/status_code");
const removeDuplicate = require("../utils/removeDuplicate");
const { request, response } = require("express");

const gestionRouter = express.Router();

/**
 * @swagger
 * /api/v1/gestion/cocktails-du-moment:
 *   put:
 *     tags:
 *       - Gestion
 *     description: modifie la liste des cocktails du moment
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: nomAncienCocktail
 *         description: nom de l'ancien cocktail du moment
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: nomNouveauCocktail
 *         description: nom du nouveau cocktail du moment
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modification réussie
 *       404:
 *         description: Les cocktails du moment n'ont pas été récupéré
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
gestionRouter.put(
  "/cocktails-du-moment",
  isAuthenticated,
  haveRight,
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

/**
 * @swagger
 * /api/v1/gestion/cocktails:
 *   post:
 *     tags:
 *       - Gestion
 *     description: Ajoute un nouveau cocktail
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: cocktail
 *         description: Le cocktail à créer
 *         schema:
 *           type: object
 *         required:
 *           - nom
 *           - photo
 *           - verre
 *           - ingredients
 *           - etape
 *           - alcoolise
 *         properties:
 *           nom:
 *             type: string
 *           photo:
 *             type: string
 *           verre:
 *             type: string
 *           ingredients:
 *             type: array
 *           etapes:
 *             type: array
 *           alcoolise:
 *             type: boolean
 *     responses:
 *       201:
 *         description: créé et retourne un tableau de cocktails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       400:
 *         description: Création impossible
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
gestionRouter.post(
  "/cocktails",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { nom, photo, verre, ingredients, etapes, alcoolise } = request.body;

    if (
      !nom ||
      nom === "" ||
      !photo ||
      photo === "" ||
      !verre ||
      verre === "" ||
      !ingredients ||
      ingredients.length === 0 ||
      !etapes ||
      etapes.length === 0
    ) {
      response.status(BAD_REQUEST);
      response.json("Des données sont manquantes pour l'ajout du cocktail");
    } else {
      logger.info(`Trying to get verre's id of ${verre}`);
      const idVerre = await recupererIdVerre(verre);

      logger.info(`Trying to add cocktail ${nom}`);
      const idCocktail = await ajouterUnCocktail(
        nom,
        photo,
        idVerre,
        alcoolise
      );

      for (let i = 0; i < ingredients.length; i++) {
        logger.info(
          `Trying to get ingredient's id of ${ingredients[i].nomIng}`
        );
        const idIngredient = await recupererIdIngredient(ingredients[i].nomIng);

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

        logger.info(`Trying to bind cocktail ${nom} whith etape ${e + 1}}`);
        await lierCocktailEtape(idCocktail, idEtape);
      }

      const cocktails = await recupererLesCocktails("indifferent");

      response.status(CREATED);
      response.json(cocktails);
    }
  }
);

gestionRouter.put(
  "/cocktails",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id, nom, photo } = request.body;
    console.log(id, photo);

    if (nom !== "") await modifierNomCocktail(id, nom);
    if (photo !== "") await modifierPhotoCocktail(id, photo);

    const cocktails = await recupererLesCocktails("indifferent");

    response.status(OK).json(cocktails);
  }
);

/**
 * @swagger
 * /api/v1/gestion/cocktail/{id}:
 *   delete:
 *     tags:
 *       - Gestion
 *     description: Supprime un cocktail à partir de son id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: identifiant du cocktail
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suppression du cocktail réussi, retourne la nouvelle liste de cocktail
 *       400:
 *         description: Impossible de supprimer le cocktail
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Suppression impossible à réaliser
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
gestionRouter.delete(
  "/cocktail/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const idCocktail = request.params.id;
    /* if (!idCocktail) {
      logger.info(`cocktail's id is not given`);
      response.status(BAD_REQUEST);
      response.json("Un identifiant de cocktail est obligatoire");
    } */

    const idCocktailsMoment = await recupererIdCocktailsMoment();

    if (
      idCocktail !== idCocktailsMoment[0].cocktailId &&
      idCocktail !== idCocktailsMoment[1].cocktailId
    ) {
      logger.info(
        `Trying to get etapes id of the cocktail with id ${idCocktail}`
      );
      const idEtapes = await recupererEtapesId(idCocktail);

      logger.info(
        `Trying to delete cocktail with id ${idCocktail} in table cocktails_etapes`
      );
      await supprimerCocktailEtape(idCocktail);

      logger.info(
        `Trying to delete etape with id ${idEtapes} in table etapes_preparation`
      );
      for (let i = 0; i < idEtapes.length; i++) {
        await supprimerEtapePreparation(idEtapes[i].dataValues.etapeId);
      }

      logger.info(
        `Trying to delete cocktail with id ${idCocktail} in table cocktails_ingredients`
      );
      await supprimerCocktailIngredient(idCocktail);

      logger.info(
        `Trying to delete cocktail with id ${idCocktail} in table cocktails`
      );
      await supprimerUnCocktail(idCocktail);

      const cocktails = await recupererLesCocktails("indifferent");

      response.status(OK);
      response.json(cocktails);
    } else {
      logger.info(
        `delete forbidden, cocktail with id ${idCocktail} is a cocktail of the day`
      );
      response.status(FORBIDDEN);
      response.json(
        "suppression impossible, le cocktail est un cocktail du moment"
      );
    }
  }
);

gestionRouter.post(
  "/ingredient",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const ingredients = request.body;
    let exist = false;

    //suppression des doublons
    const uniqueIngredients = removeDuplicate(ingredients);

    //vérification de l'inexistance de l'ingrédient dans la liste
    for (let i = 0; i < uniqueIngredients.length; i++) {
      exist = await isIngredient(uniqueIngredients[i].nom);
      if (exist === true) {
        uniqueIngredients.splice(i, 1);
      } else i++;
    }

    logger.info(`Adding ingredients in database`);
    await ajouterIngredientsDB(uniqueIngredients);

    logger.info(`Trying to get list of ingredients`);
    const listeIngredients = await recupererLesIngredients();

    response.status(CREATED);
    response.json(listeIngredients);
  }
);

gestionRouter.post(
  "/verre",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const verres = request.body;

    //suppression des doublons
    const uniqueVerres = removeDuplicate(verres);

    //vérification de l'inexistance du verre dans la liste
    for (let i = 0; i < uniqueVerres.length; i++) {
      exist = await verreExistant(uniqueVerres[i].nom);
      if (exist === true) {
        uniqueVerres.splice(i, 1);
      } else i++;
    }

    logger.info(`Adding glasses in database`);
    await ajouterVerresDB(uniqueVerres);

    logger.info(`Trying to get list of glasses`);
    const listeVerres = await recupererLesVerres();

    response.status(CREATED);
    response.json(listeVerres);
  }
);

gestionRouter.delete(
  "/verre/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const idVerre = request.params.id;

    // vérification de l'inutilité du verre avant sa suppression
    logger.info("Verify utility of glass");
    const verreUtil = await verificationVerreUtil(idVerre);
    console.log(verreUtil);

    if (verreUtil === false) {
      logger.info(
        `Trying to remove the glass with id ${idVerre} from database`
      );
      await supprimerUnVerre(idVerre);

      logger.info(`Trying to get list of glasses`);
      const listeVerres = await recupererLesVerres();

      response.status(OK);
      response.json(listeVerres);
    } else {
      logger.info(
        `delete forbidden, glass with id ${idVerre} is used in a cocktail`
      );
      response.status(FORBIDDEN);
      response.json(
        "suppression impossible, le verre est utilisé pour un cocktail"
      );
    }
  }
);

module.exports = gestionRouter;
