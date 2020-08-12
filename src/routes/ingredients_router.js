const express = require("express");

const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");

const {
  recupererLesIngredients,
  isIngredient,
  ajouterIngredientsDB
} = require("../controllers/ingredients_controller");

const { OK, CREATED } = require("../helpers/status_code");

const logger = require("../helpers/logger");
const removeDuplicate = require("../utils/removeDuplicate");

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

ingredientRouter.post(
  "/",
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

module.exports = ingredientRouter;
