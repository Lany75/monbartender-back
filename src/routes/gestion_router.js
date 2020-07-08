const express = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");
const logger = require("../helpers/logger");

const {
  recupererIdCocktail,
  recupererUnCocktail,
  ajouterUnCocktail,
  recupererLesCocktails,
  supprimerUnCocktail
} = require("../controllers/cocktails_controller");
const {
  recupererIdCocktailsMoment,
  modifierCocktailMoment
} = require("../controllers/cocktailsMoment_controller");

const {
  lierCocktailIngredient,
  supprimerCocktailIngredient
} = require("../controllers/cocktailsIngredientsController");

const {
  ajouterEtapePreparation,
  supprimerEtapePreparation
} = require("../controllers/etapesPreparation_controller");

const {
  lierCocktailEtape,
  recupererEtapesId,
  supprimerCocktailEtape
} = require("../controllers/cocktailsEtapes_controller");

const { recupererIdVerre } = require("../controllers/verres_controller");

const {
  recupererIdIngredient,
  ajouterUnIngredientDB,
  recupererLesIngredients
} = require("../controllers/ingredients_controller");

const {
  OK,
  NOT_FOUND,
  CREATED,
  BAD_REQUEST
} = require("../helpers/status_code");

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

    console.log(nom, photo, verre, ingredients, etapes, alcoolise);
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

/**
 * @swagger
 * /api/v1/gestion/{id}:
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
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
gestionRouter.delete(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const idCocktail = request.params.id;
    if (!idCocktail) {
      logger.info(`cocktail's id is not given`);
      response.status(BAD_REQUEST);
      response.json("Un identifiant de cocktail est obligatoire");
    }

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
  }
);

gestionRouter.post(
  "/ingredient",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { nvIngredient } = request.query;
    console.log(nvIngredient);
    await ajouterUnIngredientDB(nvIngredient);
    const ingredients = await recupererLesIngredients();

    response.status(OK).json(ingredients);
  }
);

module.exports = gestionRouter;
