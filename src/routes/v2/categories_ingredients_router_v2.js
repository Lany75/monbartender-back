const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getAllCategories,
  getIdCategorie,
  addCategory,
  categoryIdIsExisting,
  getNameCategory,
  putOneCategory,
  deleteCategoryIngredient
} = require("../../controllers/v2/categoriesIngredients_controller_v2");

const {
  categoryIsUsed
} = require('../../controllers/v2/ingredients_controller_v2');

const {
  OK,
  BAD_REQUEST,
  CREATED,
  FORBIDDEN
} = require("../../helpers/status_code");

const categoriesRouterV2 = express.Router();

categoriesRouterV2.get('/', async (request, response) => {
  logger.info(`Trying to get all categories of ingredients`);
  const categories = await getAllCategories();
  response
    .status(OK)
    .json(categories);
})

categoriesRouterV2.post('/',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { nom } = request.body;
    const formatName = nom?.replace(/\s+/g, ' ').trim();

    if (
      !(nom &&
        /\S/.test(formatName) &&
        formatName.length >= 2 &&
        formatName.length <= 30)
    ) {
      response
        .status(BAD_REQUEST)
        .json('Data missing or category name is not correct for adding');
    } else {
      if (await getIdCategorie(formatName.toUpperCase())) {
        response
          .status(FORBIDDEN)
          .json(`A category with name ${formatName} already exist`);
      } else {
        logger.info(`Trying to add category ${formatName}`);
        try {
          await addCategory(formatName.toUpperCase());
        } catch (error) {
          logger.error(
            `An error has occured while adding glass, message: ${error.message}`
          );
        }
        logger.info(`Trying to get all categories`);
        const categories = await getAllCategories();
        response
          .status(CREATED)
          .json(categories);
      }
    }
  })

categoriesRouterV2.put(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom } = request.body;

    if (await categoryIdIsExisting(id)) {
      if (!nom || nom === '') {
        response
          .status(BAD_REQUEST)
          .json("Data missing for category modification");
      } else {
        logger.info(`Trying to get category ${nom.toUpperCase()}`);
        const category = await getNameCategory(nom.toUpperCase());

        if (!category || category.id === id) {
          logger.info(`Trying to modify category ${id}`);
          await putOneCategory(id, nom.toUpperCase());
        }
      }

      logger.info(`Trying to get all categories`);
      const categories = await getAllCategories();

      response
        .status(OK)
        .json(categories);

    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  })

categoriesRouterV2.delete(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;

    if (await categoryIdIsExisting(id)) {
      if (!await categoryIsUsed(id)) {
        logger.info(`Trying to delete category in categories_ingredients table`);
        await deleteCategoryIngredient(id);
      }

      logger.info(`Trying to get all categories`);
      const categories = await getAllCategories();

      response
        .status(OK)
        .json(categories);
    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  })

module.exports = categoriesRouterV2;