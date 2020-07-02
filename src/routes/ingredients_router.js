const express = require("express");

const isAuthenticated = require("../middlewares/is_authenticated");

const {
  recupererLesIngredients,
  recupererIdIngredient,
  ajouterUnIngredientDB
} = require("../controllers/ingredients_controller");

const {
  recupererQuantiteIngredient
} = require("../controllers/cocktailsIngredientsController");

const {
  recupererIdBar,
  recupererUnBar
} = require("../controllers/bars_controller");

const {
  ajouterUnIngredientAuBar,
  supprimerUnIngredientDuBar,
  estDansLeBar
} = require("../controllers/barsIngredients_controller");

const { recupererUnCocktail } = require("../controllers/cocktails_controller");

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND
} = require("../helpers/status_code");

const logger = require("../helpers/logger");

const ingredientRouter = express.Router();

const regex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

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

  if (!ingredients) {
    logger.info(`Ingredients not found`);
    response.statut(NOT_FOUND);
    response.json("La liste des ingrédients n'a pas été récupérée");
  } else {
    logger.info(`Ingredients found`);
    response.status(OK);
    response.json(ingredients);
  }
});

/**
 * @swagger
 * /api/v1/ingredients/quantite:
 *   get:
 *     tags:
 *       - Ingredients
 *     description: Retourne la quantité pour chaque ingrédient d'un cocktail
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: cocktailId
 *         schema:
 *           type: string
 *         description: l'id d'un cocktail
 *     responses:
 *       200:
 *         description: Un tableau contenant l'id de l'ingredient et sa quantité
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CocktailIngredient'
 *       404:
 *         description: Aucun ingredient n'existe
 */
ingredientRouter.get("/quantite", async (request, response) => {
  const { cocktailId } = request.query;
  const quantiteIngredient = [];

  logger.info("Verifying cocktailId match with a uuid definition");
  if (!regex.test(cocktailId)) {
    logger.info("cocktailId is not an uuid");
    response.status(NOT_FOUND).json(`${cocktailId} is not an uuid`);
  } else {
    logger.info(`Verifying cocktail with id ${cocktailId} exist`);
    const cocktail = await recupererUnCocktail(cocktailId);
    //console.log(cocktail);

    if (!cocktail) {
      logger.info(`cocktail with id ${cocktailId} doesn't exist`);
      response.status(NOT_FOUND).json("Aucun cocktail avec cet id n'existe");
    } else {
      logger.info(`Trying to get quantity of ingredient`);
      const quantite = await recupererQuantiteIngredient(cocktailId);

      for (let i = 0; i < quantite.length; i++) {
        quantiteIngredient.push(quantite[i].dataValues);
      }

      logger.info(`quantity of ingredient has been found`);

      response.status(OK);
      response.json(quantiteIngredient);
    }
  }
});

/**
 * @swagger
 * /api/v1/ingredients/{nomNouvelIngredient}:
 *   post:
 *     tags:
 *       - Ingredients
 *     description: Ajoute un nouvel ingredient au bar de l'utilisateur
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nomNouvelIngredient
 *         description: nom de l'ingrédient à ajouter
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Ajout de l'ingrédient réussi, retourne le bar modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       400:
 *         description: Impossible d'ajouter l'ingrédient au bar de l'utilisateur
 *       401:
 *         description: Non autorisé
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
    let exist = false;

    logger.info(
      `Trying to add the ingredient:${nomNouvelIngredient} to ${mail}'s bar`
    );

    const idIngredient = await recupererIdIngredient(nomNouvelIngredient);
    console.log(idIngredient);

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

    if (idBar && idIngredient) {
      logger.info(
        `verify ingredient:${nomNouvelIngredient} to ${mail}'s bar is existing`
      );
      exist = await estDansLeBar(idBar, idIngredient);

      if (exist === false) {
        logger.info(`${nomNouvelIngredient} doesn't exist in ${mail}'s bar `);
        try {
          logger.info(
            `Adding ingredient ${nomNouvelIngredient} to ${mail}'s bar`
          );
          await ajouterUnIngredientAuBar(idIngredient, idBar);
        } catch (e) {
          logger.error(
            `An error has occured while adding ingredient:${nomNouvelIngredient} to ${mail}'s bar, message: ${e.message}, stack trace: ${e.stack}`
          );
        }
      } else {
        logger.info(`${nomNouvelIngredient} already exist in ${mail}'s bar`);
      }

      const bar = await recupererUnBar(mail);

      response.status(CREATED).json(bar);
    }
  }
);

/**
 * @swagger
 * /api/v1/ingredients/{nomIngredientSupprime}:
 *   delete:
 *     tags:
 *       - Ingredients
 *     description: Supprime l'ingredient du bar de l'utilisateur
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nomIngredientSupprime
 *         description: nom de l'ingrédient à supprimer
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suppression de l'ingrédient réussi, retourne le bar modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       400:
 *         description: Impossible de supprimer l'ingrédient du bar de l'utilisateur
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

    if (idBar && idIngredient) {
      logger.info(
        `Removing ingredient ${nomIngredientSupprime} from ${mail}'s bar`
      );
      await supprimerUnIngredientDuBar(idIngredient, idBar);

      const bar = await recupererUnBar(mail);
      response.status(OK).json(bar);
    }
  }
);

module.exports = ingredientRouter;
