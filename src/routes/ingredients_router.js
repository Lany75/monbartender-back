const express = require("express");

const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");

const {
  recupererLesIngredients,
  ingredientExistant,
  ajouterIngredientsDB,
  supprimerUnIngredient
} = require("../controllers/ingredients_controller");

const { OK, CREATED, FORBIDDEN } = require("../helpers/status_code");

const logger = require("../helpers/logger");
const removeDuplicate = require("../utils/removeDuplicate");
const {
  verificationIngredientUtil
} = require("../controllers/cocktailsIngredients_controller");

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
    //let exist = false;

    //suppression des doublons
    const uniqueIngredients = removeDuplicate(ingredients);

    //vérification de l'inexistance de l'ingrédient dans la liste
    for (let i = 0; i < uniqueIngredients.length; i++) {
      const exist = await ingredientExistant(uniqueIngredients[i].nom);
      if (exist === true) {
        uniqueIngredients.splice(i, 1);
        i--;
      }
    }

    logger.info(`Adding ingredients in database`);
    await ajouterIngredientsDB(uniqueIngredients);

    logger.info(`Trying to get list of ingredients`);
    const listeIngredients = await recupererLesIngredients();

    response.status(CREATED);
    response.json(listeIngredients);
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
    console.log(ingredientUtil);

    if (ingredientUtil === false) {
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
