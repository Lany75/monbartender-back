const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getAllCategories,
  getIdCategorie
} = require("../../controllers/v2/categoriesIngredients_controller_v2");
const {
  getAllIngredients,
  putOneIngredient
} = require('../../controllers/v2/ingredients_controller_v2');

const ingredientsRouterV2 = express.Router();

ingredientsRouterV2.get('/', async (request, response) => {
  logger.info(`Trying to get all ingredients`);
  const ingredients = await getAllIngredients();
  response.status(200).json(ingredients);
})

ingredientsRouterV2.get('/categories', async (request, response) => {
  logger.info(`Trying to get all categories of ingredients`);
  const categories = await getAllCategories();
  response.status(200).json(categories);
})

ingredientsRouterV2.put('/:id', isAuthenticated, haveRight, async (request, response) => {
  const { id } = request.params;
  const { nom, categorie } = request.body;

  logger.info(`Trying to get id of categorie ${categorie}`);
  const categorieId = await getIdCategorie(categorie);

  logger.info(`Trying to modify ingredients ${id}`);
  const newIngredient = await putOneIngredient(id, nom, categorieId);

  const ingredients = await getAllIngredients();

  response.status(200).json(ingredients);
})

module.exports = ingredientsRouterV2;