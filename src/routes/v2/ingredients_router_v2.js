const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getIdCategorie,
} = require("../../controllers/v2/categoriesIngredients_controller_v2");

const {
  getAllIngredients,
  putOneIngredient,
  idIsExisting,
  getNameIngredient,
  addIngredient,
  deleteIngredient,
} = require('../../controllers/v2/ingredients_controller_v2');

const {
  ingredientIsUsed
} = require('../../controllers/v2/cocktailsIngredients_controller_v2');

const {
  deleteIngredientBars
} = require("../../controllers/v2/barsIngredients_controller_v2");

const {
  OK,
  BAD_REQUEST,
  CREATED
} = require("../../helpers/status_code");

const camelCaseText = require("../../utils/camelCaseText");

const ingredientsRouterV2 = express.Router();

ingredientsRouterV2.get('/', async (request, response) => {
  logger.info(`Trying to get all ingredients`);
  const ingredients = await getAllIngredients();
  response
    .status(OK)
    .json(ingredients);
})

ingredientsRouterV2.post('/',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { nom, categorie } = request.body;

    if (!nom || nom === '' || !categorie || categorie === '') {
      response
        .status(BAD_REQUEST)
        .json("Data missing for ingredient adding");
    } else {

      if (!await getNameIngredient(camelCaseText(nom))) {
        logger.info(`Trying to get id of categorie ${categorie}`);
        const categorieId = await getIdCategorie(categorie);

        if (categorieId) {
          logger.info(`Trying to add ingredient ${nom}`);
          await addIngredient(camelCaseText(nom), categorieId);
        }
      }

      logger.info(`Trying to get all ingredients`);
      const ingredients = await getAllIngredients();

      response
        .status(CREATED)
        .json(ingredients);
    }
  })

ingredientsRouterV2.put(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom, categorie } = request.body;

    if (await idIsExisting(id)) {
      if (!nom || nom === '' || !categorie || categorie === '') {
        response
          .status(BAD_REQUEST)
          .json("Data missing for ingredient modification");
      } else {
        logger.info(`Trying to get ingredient ${camelCaseText(nom)}`);
        const ingredient = await getNameIngredient(camelCaseText(nom));

        if (!ingredient || ingredient.id === id) {
          logger.info(`Trying to get id of categorie ${categorie}`);
          const categorieId = await getIdCategorie(categorie);

          if (categorieId) {
            logger.info(`Trying to modify ingredients ${id}`);
            await putOneIngredient(id, camelCaseText(nom), categorieId);
          }
        }

        logger.info(`Trying to get all ingredients`);
        const ingredients = await getAllIngredients();

        response
          .status(OK)
          .json(ingredients);
      }
    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  })

ingredientsRouterV2.delete(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;

    if (await idIsExisting(id)) {
      if (!await ingredientIsUsed(id)) {
        logger.info(`Trying to delete ingredient in bar-ingredients table`);
        await deleteIngredientBars(id);

        logger.info(`Trying to delete ingredient in ingredients table`);
        await deleteIngredient(id);
      }

      logger.info(`Trying to get all ingredients`);
      const ingredients = await getAllIngredients();

      response
        .status(OK)
        .json(ingredients);
    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  })

module.exports = ingredientsRouterV2;