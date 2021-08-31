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
  ingredientIdIsExisting,
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
  CREATED,
  FORBIDDEN
} = require("../../helpers/status_code");

const camelCaseText = require("../../utils/camelCaseText");
const checkUUID = require('../../utils/checkUUID');

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
    const formatName = nom?.replace(/\s+/g, ' ').trim();

    if (
      !(categorie && nom &&
        /\S/.test(formatName) &&
        formatName.length >= 2 &&
        formatName.length <= 30)
    ) {
      response
        .status(BAD_REQUEST)
        .json('Data missing or ingredient name is not correct for adding');
    } else {
      const categoryId = await getIdCategorie(categorie.toUpperCase());
      if (
        await getNameIngredient(camelCaseText(formatName)) ||
        !categoryId
      ) {
        response
          .status(FORBIDDEN)
          .json('Impossible to add ingredient');
      } else {
        logger.info(`Trying to add ingredient ${formatName}`);
        await addIngredient(camelCaseText(formatName), categoryId);

        logger.info(`Trying to get all ingredients`);
        const ingredients = await getAllIngredients();

        response
          .status(CREATED)
          .json(ingredients);
      }
    }
  })

ingredientsRouterV2.put(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom, categorie } = request.body;

    if (await ingredientIdIsExisting(id)) {
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

ingredientsRouterV2.delete('/', isAuthenticated, haveRight, async (request, response) => {
  const { deletedIngredients } = request.body;

  if (!deletedIngredients || deletedIngredients.length === 0) {
    response
      .status(BAD_REQUEST)
      .json("Aucun ingredient à supprimer");
  } else {
    logger.info(`Trying to delete ingredients from database`);
    const promiseTab = [];
    for (let i = 0; i < deletedIngredients.length; i++) {
      if (
        checkUUID(deletedIngredients[i]) &&
        await ingredientIdIsExisting(deletedIngredients[i]) &&
        !await ingredientIsUsed(deletedIngredients[i])
      ) {
        promiseTab.push(deleteIngredientBars(deletedIngredients[i]));
        promiseTab.push(deleteIngredient(deletedIngredients[i]));
      }
    }

    await Promise.all(promiseTab);

    logger.info(`Trying to get all ingredients`);
    const ingredients = await getAllIngredients();
    response.status(OK).json(ingredients);

  }
})

module.exports = ingredientsRouterV2;