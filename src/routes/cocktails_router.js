const express = require("express");
const logger = require("../helpers/logger");

const {
  recupererLesCocktails,
  recupererUnCocktail,
  recupererUnCocktailAleatoire,
  recupererIdCocktailsMoment
} = require("../controllers/cocktails_controller");
const {
  rechercherUnCocktailParSonNom,
  rechercherCocktailsParIngredients
} = require("../controllers/recherche_controller");
const {
  recupererIdIngredient
} = require("../controllers/ingredients_controller");

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
  logger.info(`Trying to get all cocktails`);
  const cocktails = await recupererLesCocktails();

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
  const { ingredient1, ingredient2, ingredient3 } = request.query;
  let idIngredient1, cocktailsIngredient1;
  let idIngredient2, cocktailsIngredient2;
  let idIngredient3, cocktailsIngredient3;
  const cocktails = [];

  if (ingredient1 === "" && ingredient2 === "" && ingredient3 === "") {
    logger.info(`Ingredients are not given`);
    response.status(NOT_FOUND).json("Pas d'ingrédient, pas de cocktails");
  }

  if (!ingredient1 && !ingredient2 && !ingredient3) {
    logger.info(`Ingredients are not given`);
    response.status(NOT_FOUND).json("Pas d'ingrédient, pas de cocktails");
  }

  if (ingredient1) {
    logger.info(`Trying to get ${ingredient1}'s id`);
    idIngredient1 = await recupererIdIngredient(ingredient1);
    if (!idIngredient1) {
      logger.info(`${ingredient1} does not exist`);
      response.status(NOT_FOUND).json("l'ingredient n'existe pas");
    }
    logger.info(`Trying to get cocktails include ${ingredient1}`);
    cocktailsIngredient1 = await rechercherCocktailsParIngredients(
      idIngredient1
    );
  }

  if (ingredient2) {
    logger.info(`Trying to get ${ingredient2}'s id`);
    idIngredient2 = await recupererIdIngredient(ingredient2);
    if (!idIngredient2) {
      logger.info(`${ingredient2} does not exist`);
      response.status(NOT_FOUND).json("l'ingredient n'existe pas");
    }
    logger.info(`Trying to get cocktails include ${ingredient2}`);
    cocktailsIngredient2 = await rechercherCocktailsParIngredients(
      idIngredient2
    );
  }

  if (ingredient3) {
    logger.info(`Trying to get ${ingredient3}'s id`);
    idIngredient3 = await recupererIdIngredient(ingredient3);
    if (!idIngredient3) {
      logger.info(`${ingredient3} does not exist`);
      response.status(NOT_FOUND).json("l'ingredient n'existe pas");
    }
    logger.info(`Trying to get cocktails include ${ingredient3}`);
    cocktailsIngredient3 = await rechercherCocktailsParIngredients(
      idIngredient3
    );
  }

  const tableauCocktails = [];

  if (idIngredient1) {
    cocktailsIngredient1.map(ci1 => {
      tableauCocktails.push(ci1.dataValues.cocktailId);
    });
  }
  if (idIngredient2) {
    cocktailsIngredient2.map(ci2 => {
      tableauCocktails.push(ci2.dataValues.cocktailId);
    });
  }
  if (idIngredient3) {
    cocktailsIngredient3.map(ci3 => {
      tableauCocktails.push(ci3.dataValues.cocktailId);
    });
  }

  const tableauCocktailsUnique = new Set(tableauCocktails);
  const tabIdResultat = [...tableauCocktailsUnique];

  for (let i = 0; i < tabIdResultat.length; i++) {
    cocktailProvisoire = await recupererUnCocktail(tabIdResultat[i]);

    cocktails.push({
      id: tabIdResultat[i],
      nom: cocktailProvisoire.dataValues.nom,
      photo: cocktailProvisoire.dataValues.photo
    });
  }

  response.status(OK).json(cocktails);
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
    }
    logger.info(`Cocktail found`);
    response.status(OK);
    response.json(cocktail);
  }
);

module.exports = cocktailsRouter;
