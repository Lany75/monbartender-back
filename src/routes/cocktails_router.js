const express = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const logger = require("../helpers/logger");

const {
  recupererLesCocktails,
  recupererUnCocktail,
  rechercherUnCocktailParSonNom,
  rechercherCocktailsParIngredients,
  recupererUnCocktailAleatoire
} = require("../controllers/cocktails_controller");
const {
  recupererIdCocktailsMoment
} = require("../controllers/cocktailsMoment_controller");

const { OK, NOT_FOUND } = require("../helpers/status_code");

const cocktailsRouter = express.Router();

/**
 * @swagger
 * /api/v1/cocktails:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Retourne la liste de tous les cocktails
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: alcool
 *         schema:
 *           type: string
 *         required: true
 *         description: l'alcool du cocktail (true, false, indifferent)
 *     responses:
 *       200:
 *         description: Un tableau de cocktails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get("/", async (request, response) => {
  const { alcool } = request.query;
  logger.info(`Trying to get all cocktails`);
  const cocktails = await recupererLesCocktails(alcool);

  if (!cocktails) {
    logger.info(`Cocktails list has not been found`);
    response.statut(NOT_FOUND);
    response.json("La liste de cocktails n'a pas été récupérée");
  } else {
    logger.info(`Cocktails list has been found`);
    response.status(OK);
    response.json(cocktails);
  }
});

/**
 * @swagger
 * /api/v1/cocktails/cocktail-du-moment:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Retourne la liste des cocktails du moment
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de cocktails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get("/cocktail-du-moment", async (request, response) => {
  const cocktailsMoment = [];

  logger.info(`Trying to get cocktails of the day`);
  const idCocktailsMoment = await recupererIdCocktailsMoment();

  if (!idCocktailsMoment) {
    logger.info(`Cocktails of the day list has not been found`);
    response
      .status(NOT_FOUND)
      .json("La liste de cocktail n'a pas été récupérée");
  } else {
    logger.info(`Cocktails of the day list has been found`);
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
});

/**
 * @swagger
 * /api/v1/cocktails/aleatoire:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Retourne un cocktail au hasard
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get("/aleatoire", async (request, response) => {
  logger.info(`Trying to get a random cocktail`);
  const cocktailAleatoire = await recupererUnCocktailAleatoire();

  if (!cocktailAleatoire) {
    logger.info(`Random cocktail has not been found`);
    response
      .status(NOT_FOUND)
      .json("Le cocktail aléatoire n'a pas été récupéré");
  }

  logger.info(`Random cocktail has been found`);
  response.status(OK);
  response.json(cocktailAleatoire);
});

/**
 * @swagger
 * /api/v1/cocktails/rechercher-par-nom:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Recherche une liste de cocktails à partir d'un nom
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         required: true
 *         description: le nom du cocktail recherché
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       400:
 *         description : Le nom du cocktail n'est pas renseigné
 *       404:
 *         description: Aucun cocktail n'existe
 */

cocktailsRouter.get("/rechercher-par-nom", async (request, response) => {
  const { nom } = request.query;

  if (!nom) {
    logger.info(`Cocktail's name is not given`);
    response.status(BAD_REQUEST);
    response.json("Un nom de cocktail est obligatoire");
  }

  logger.info(`Trying to get cocktails that match ${nom}`);
  const cocktail = await rechercherUnCocktailParSonNom(nom);

  if (!cocktail) {
    logger.info(`Cocktail has not been found`);
    response.status(NOT_FOUND);
    response.json("Le cocktail n'a pas été trouvé");
  }

  logger.info(`Cocktail has been found`);
  response.status(OK);
  response.json(cocktail);
});

/**
 * @swagger
 * /api/v1/cocktails/rechercher-par-ingredient:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Recherche une liste de cocktails à partir d'ingrédients
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: ingredient1
 *         schema:
 *           type: string
 *         description: le nom d'un ingrédient
 *       - in: query
 *         name: ingredient2
 *         schema:
 *           type: string
 *         description: le nom d'un ingrédient
 *       - in: query
 *         name: ingredient3
 *         schema:
 *           type: string
 *         description: le nom d'un ingrédient
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail trouvé
 */

cocktailsRouter.get("/rechercher-par-ingredient", async (request, response) => {
  const { ingredient1, ingredient2, ingredient3, alcool } = request.query;
  const tableauIngredient = [ingredient1, ingredient2, ingredient3];
  const tableauCocktails = [];

  logger.info(
    `Trying to get cocktails with ingredients ${ingredient1}, ${ingredient2}, ${ingredient3}`
  );
  const cocktails = await rechercherCocktailsParIngredients(
    tableauIngredient,
    alcool
  );

  console.log(cocktails);

  cocktails.map(cocktail => {
    tableauCocktails.push({
      id: cocktail.dataValues.id,
      nom: cocktail.dataValues.nom,
      photo: cocktail.dataValues.photo
    });
  });

  if (tableauCocktails.length === 0) {
    logger.info(`No cocktails found for this search`);
    response.status(OK).json(tableauCocktails);
    //response.status(NOT_FOUND).json(`Aucun cocktail trouvé`);
  } else {
    logger.info(`Cocktails found, remove duplicate`);
    const tableauCocktailsUnique = new Set(tableauCocktails);
    const sortedCocktails = [...tableauCocktailsUnique];

    response.status(OK).json(sortedCocktails);
  }
});

/**
 * @swagger
 * /api/v1/cocktails/{id}:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Recherche un cocktail à partir de son id
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
 *         description: Un cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       400:
 *         description : L'id du cocktail n'est pas renseigné
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  async (request, response) => {
    const { id } = request.params;
    if (!id) {
      logger.info(`cocktail's id is not given`);
      response.status(BAD_REQUEST);
      response.json("Un identifiant de cocktail est obligatoire");
    }
    logger.info(`Trying to get cocktail with id ${id}`);
    const cocktail = await recupererUnCocktail(id);

    if (!cocktail) {
      logger.info(`Cocktail not found`);
      response.status(NOT_FOUND);
      response.json("Le cocktail n'a pas été trouvé");
    } else {
      logger.info(`Cocktail found`);
      response.status(OK);
      response.json(cocktail);
    }
  }
);

module.exports = cocktailsRouter;
