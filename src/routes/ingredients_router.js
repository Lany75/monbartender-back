const express = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const {
  recupererLesIngredients,
  recupererIdIngredient,
  ajouterUnIngredientDB
} = require("../controllers/ingredients_controller");
const {
  recupererIdBar,
  ajouterUnIngredientAuBar,
  recupererUnBar,
  supprimerUnIngredientDuBar
} = require("../controllers/bars_controller");
const { OK, CREATED, BAD_REQUEST } = require("../helpers/status_code");
const logger = require("../helpers/logger");
const ingredientRouter = express.Router();

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
 *         description: Un tableau d'ingredient
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Aucun ingredient n'existe
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
ingredientRouter.get("/", async (request, response) => {
  logger.info(`Trying to get the ingredients`);
  const ingredients = await recupererLesIngredients();

  response.status(OK);
  response.json(ingredients);
});

/**
 * @swagger
 * /api/v1/ingredients:
 *   post:
 *     tags:
 *       - Ingredients
 *     description: Ajoute un nouvel ingredient au bar
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email de l'utilisateur
 *         in: body
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Retourne le bar modifie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       401:
 *         description: Non autorisé
 *       400:
 *         description: L ingredient existe deja dans le bar
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
ingredientRouter.post(
  "/:nomNouvelIngredient",
  isAuthenticated,
  async (request, response) => {
    const mail = request.user.email;
    const nomNouvelIngredient = request.params.nomNouvelIngredient;

    logger.info(
      `Trying to add the ingredient:${nomNouvelIngredient} to ${mail}'s bar`
    );

    const idIngredient = await recupererIdIngredient(nomNouvelIngredient);
    const idBar = await recupererIdBar(mail);

    if (!idBar) {
      logger.info(`${mail}'s bar does not exist`);
      response
        .status(BAD_REQUEST)
        .json(`Aucun bar n'a été trouvé pour l'utilisateur:${mail}`);
    }
    if (!idIngredient) {
      logger.info(`The given ingredient ${nomNouvelIngredient} does not exist`);
      response
        .status(BAD_REQUEST)
        .json(
          `Aucun ingrédient n'a été trouvé avec le nom:${nomNouvelIngredient}`
        );
    }

    try {
      logger.info(`Adding ingredient ${nomNouvelIngredient} to ${mail}'s bar`);
      await ajouterUnIngredientAuBar(idIngredient, idBar);
    } catch (e) {
      logger.error(
        `An error has occured while adding ingredient:${nomNouvelIngredient} to ${mail}'s bar, message: ${e.message}, stack trace: ${e.stack}`
      );
      response.status(BAD_REQUEST).json("L'ingrédient existe déja");
    }

    const bar = await recupererUnBar(mail);

    response.status(CREATED).json(bar);
  }
);

/**
 * @swagger
 * /api/v1/ingredients/:
 *   delete:
 *     tags:
 *       - Ingredients
 *     description: Ajoute un nouvel ingredient au bar
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email de l'utilisateur
 *         in: body
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Retourne le bar modifie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       401:
 *         description: Non autorisé
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
ingredientRouter.delete(
  "/:nomIngredientSupprime",
  isAuthenticated,
  async (request, response) => {
    const mail = request.user.email;
    const nomIngredientSupprime = request.params.nomIngredientSupprime;

    logger.info(
      `Trying to remove the ingredient:${nomIngredientSupprime} from ${mail}'s bar`
    );

    const idIngredient = await recupererIdIngredient(nomIngredientSupprime);
    const idBar = await recupererIdBar(mail);

    if (!idBar) {
      logger.info(`${mail}'s bar does not exist`);
      response
        .status(BAD_REQUEST)
        .json(`Aucun bar n'a été trouvé pour l'utilisateur:${mail}`);
    }
    if (!idIngredient) {
      logger.info(
        `The given ingredient ${nomIngredientSupprime} does not exist`
      );
      response
        .status(BAD_REQUEST)
        .json(
          `Aucun ingrédient n'a été trouvé avec le nom:${nomIngredientSupprime}`
        );
    }

    logger.info(
      `Removing ingredient ${nomIngredientSupprime} from ${mail}'s bar`
    );
    await supprimerUnIngredientDuBar(idIngredient, idBar);

    const bar = await recupererUnBar(mail);
    response.status(OK).json(bar);
  }
);

module.exports = ingredientRouter;
