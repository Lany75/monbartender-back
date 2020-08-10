require("dotenv").config();
const express = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const logger = require("../helpers/logger");

const {
  recupererUnBar,
  recupererIdBar,
  creerUnBar
} = require("../controllers/bars_controller");

const {
  recupererIdIngredient
} = require("../controllers/ingredients_controller");

const {
  estDansLeBar,
  ajouterUnIngredientAuBar,
  supprimerUnIngredientDuBar
} = require("../controllers/barsIngredients_controller");

const { OK, NOT_FOUND, CREATED } = require("../helpers/status_code");

const barsRouter = express.Router();

/**
 * @swagger
 * /api/v1/bars:
 *   get:
 *     tags:
 *       - Bars
 *     description: Retourne le bar de l'utilisateur courant
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un bar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bar'
 *       401:
 *         description: Non autorisé
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
barsRouter.get("/", isAuthenticated, async (request, response) => {
  const mail = request.user.email;

  logger.info(`Trying to get ${mail}'s bar`);
  let bar = await recupererUnBar(mail);

  if (!bar || bar.length === 0) {
    logger.info(`${mail}'s bar has not been found. Creating it!`);
    bar = await creerUnBar(mail);
  }

  logger.info(`${mail}'s bar:${bar}`);
  response.status(OK);
  response.json(bar);
});

/**
 * @swagger
 * /api/v1/bars/{nomNouvelIngredient}:
 *   post:
 *     tags:
 *       - Bars
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
barsRouter.post(
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
    let idBar = await recupererIdBar(mail);

    if (!idBar) {
      logger.info(`${mail}'s bar does not exist, creating it`);
      bar = await creerUnBar(mail);
      idBar = bar.id;
    }
    if (!idIngredient) {
      logger.info(`The given ingredient ${nomNouvelIngredient} does not exist`);
      response
        .status(NOT_FOUND)
        .json(
          `Aucun ingrédient n'a été trouvé avec le nom : ${nomNouvelIngredient}`
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
 * /api/v1/bars/{nomIngredientSupprime}:
 *   delete:
 *     tags:
 *       - Bars
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
barsRouter.delete(
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
        .status(NOT_FOUND)
        .json(`Aucun bar n'a été trouvé pour l'utilisateur : ${mail}`);
    }
    if (!idIngredient) {
      logger.info(
        `The given ingredient ${nomIngredientSupprime} does not exist`
      );
      response
        .status(NOT_FOUND)
        .json(
          `ingredient ${nomIngredientSupprime} inexistant dans la base de données`
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

module.exports = barsRouter;
