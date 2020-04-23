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
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun cocktail n'existe
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
cocktailsRouter.get("/", async (request, response) => {
  logger.info(`Trying to get all cocktails`);
  const cocktails = await recupererLesCocktails();

  response.status(OK);
  response.json(cocktails);
});

/**
 * @swagger
 * /api/v1/cocktails/cocktail-du-moment:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Retourne la liste de cocktail du moment
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
cocktailsRouter.get("/cocktail-du-moment", async (request, response) => {
  logger.info(`Trying to get cocktails of the day`);
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
});

/**
 * @swagger
 * /api/v1/cocktails/aleatoire:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Retourne une liste de cocktail aléatoire
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
cocktailsRouter.get("/aleatoire", async (request, response) => {
  const cocktailAleatoire = await recupererUnCocktailAleatoire();

  if (!cocktailAleatoire) {
    response
      .status(NOT_FOUND)
      .json("Le cocktail aléatoire n'a pas été récupéré");
  }

  response.status(OK);
  response.json(cocktailAleatoire);
});

/**
 * @swagger
 * /api/v1/cocktails/rechercherparnom:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Recherche une liste de cocktail à partir de son nom
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
cocktailsRouter.get("/rechercherparnom", async (request, response) => {
  const { nom } = request.query;

  if (!nom) {
    response.status(BAD_REQUEST);
    response.json("Un nom de cocktail est obligatoire");
  }

  logger.info(`Trying to get cocktails that match ${nom}`);
  const cocktail = await rechercherUnCocktailParSonNom(nom);

  if (!cocktail) {
    response.status(NOT_FOUND);
    response.json("Le cocktail n'a pas été trouvé");
  }

  response.status(OK);
  response.json(cocktail);
});

cocktailsRouter.get("/rechercherparingredient", async (request, response) => {
  const { ingredient1, ingredient2, ingredient3 } = request.query;
  let idIngredient1, cocktailsIngredient1;
  let idIngredient2, cocktailsIngredient2;
  let idIngredient3, cocktailsIngredient3;
  const cocktails = [];

  if (ingredient1 === "" && ingredient2 === "" && ingredient3 === "") {
    response.status(NOT_FOUND).json("Pas d'ingrédient, pas de cocktails");
  }

  if (!ingredient1 && !ingredient2 && !ingredient3) {
    response.status(NOT_FOUND).json("Pas d'ingrédient, pas de cocktails");
  }

  if (ingredient1) {
    idIngredient1 = await recupererIdIngredient(ingredient1);
    if (idIngredient1 === "0")
      response.status(NOT_FOUND).json("l'ingredient1 n'existe pas");
    cocktailsIngredient1 = await rechercherCocktailsParIngredients(
      idIngredient1
    );
  }

  if (ingredient2) {
    idIngredient2 = await recupererIdIngredient(ingredient2);
    if (idIngredient2 === "0")
      response.status(NOT_FOUND).json("l'ingredient2 n'existe pas");
    cocktailsIngredient2 = await rechercherCocktailsParIngredients(
      idIngredient2
    );
  }

  if (ingredient3) {
    idIngredient3 = await recupererIdIngredient(ingredient3);
    if (idIngredient3 === "0")
      response.status(NOT_FOUND).json("l'ingredient2 n'existe pas");
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
 *         type: integer
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun cocktail n'existe
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
cocktailsRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  async (request, response) => {
    const { id } = request.params;
    if (!id) {
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

    response.status(OK);
    response.json(cocktail);
  }
);

module.exports = cocktailsRouter;
