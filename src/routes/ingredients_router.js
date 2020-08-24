const express = require("express");

const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");

const {
  recupererLesIngredients,
  ingredientExistant,
  ajouterIngredientsDB,
  supprimerUnIngredient,
  recupererUnIngredient
} = require("../controllers/ingredients_controller");

const { OK, CREATED, FORBIDDEN, NOT_FOUND } = require("../helpers/status_code");

const logger = require("../helpers/logger");
const {
  verificationIngredientUtil
} = require("../controllers/cocktailsIngredients_controller");
const {
  supprimerUnIngredientDeTousLesBars
} = require("../controllers/barsIngredients_controller");

const ingredientRouter = express.Router();

//const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

/**
 * @swagger
 * /api/v1/ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     description: Retourne la liste de tous les ingredients
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau d'ingredients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Aucun ingredient n'existe
 */
ingredientRouter.get("/", async (request, response) => {
  logger.info(`Trying to get all ingredients`);
  const ingredients = await recupererLesIngredients();

  logger.info(`Ingredients found`);
  response.status(OK);
  response.json(ingredients);
});

/**
 * @swagger
 * /api/v1/ingredients:
 *   post:
 *     tags:
 *       - Ingredients
 *     description: Ajoute un nouvel ingrédient à la base de données
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: nom
 *         description: nom de l'ingrédient ajouté
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Création de l'ingrédient réussi, retourne la nouvelle liste d'ingrédient
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
ingredientRouter.post(
  "/",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    let nomIngredient = request.query.nom;
    let exist = false;

    // Mise en majuscule de la 1ere lettre du nom
    nomIngredient = nomIngredient.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );

    //vérification de l'inexistance de l'ingrédient dans la liste
    exist = await ingredientExistant(nomIngredient);

    if (exist === false) {
      logger.info(`Adding ingredients in database`);
      await ajouterIngredientsDB(nomIngredient);

      logger.info(`Trying to get list of ingredients`);
      const listeIngredients = await recupererLesIngredients();

      response.status(CREATED);
      response.json(listeIngredients);
    } else {
      logger.info("The ingredient already exist in database");
      logger.info(`Trying to get list of ingredients`);
      const listeIngredients = await recupererLesIngredients();

      response.status(OK);
      response.json(listeIngredients);
    }
  }
);

/**
 * @swagger
 * /api/v1/ingredients/{id}:
 *   get:
 *     tags:
 *       - Ingredients
 *     description: Retourne l'ingrédient dont l'id est spécifié
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: identifiant de l'ingrédient
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un ingrédient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Aucun ingrédient avec cet id
 */
ingredientRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  async (request, response) => {
    const { id } = request.params;

    logger.info(`Trying to get ingredient with id ${id}`);
    const ingredient = await recupererUnIngredient(id);

    if (ingredient) {
      logger.info("Ingredient found");
      response.status(OK).json(ingredient);
    } else {
      logger.info("Ingredient not found");
      response.status(OK).json([]);
    }
  }
);

/**
 * @swagger
 * /api/v1/ingredients/{id}:
 *   delete:
 *     tags:
 *       - Ingredients
 *     description: Supprime un ingrédient à partir de son id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: identifiant de l'ingrédient
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suppression de l'ingrédient réussi, retourne la nouvelle liste d'ingrédient
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
ingredientRouter.delete(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const idIngredient = request.params.id;

    // vérification de l'inutilité de l'ingredient avant sa suppression
    logger.info("Verify utility of ingredient");
    const ingredientUtil = await verificationIngredientUtil(idIngredient);

    if (ingredientUtil === false) {
      logger.info("Deleting ingredient in bars_ingredients table");
      await supprimerUnIngredientDeTousLesBars(idIngredient);

      logger.info(
        `Trying to remove the ingredient with id ${idIngredient} from database`
      );
      await supprimerUnIngredient(idIngredient);

      logger.info(`Trying to get list of ingredients`);
      const listeIngredients = await recupererLesIngredients();

      response.status(OK);
      response.json(listeIngredients);
    } else {
      logger.info(
        `delete forbidden, ingredient with id ${idIngredient} is used in a cocktail`
      );
      response.status(FORBIDDEN);
      response.json(
        "suppression impossible, l'ingrédient est utilisé dans un cocktail"
      );
    }
  }
);

module.exports = ingredientRouter;
