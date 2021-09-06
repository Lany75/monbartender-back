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

const checkUUID = require('../../utils/checkUUID');

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

categoriesRouterV2.delete('/', isAuthenticated, haveRight, async (request, response) => {
  const { deletedCategories } = request.body;

  if (!deletedCategories || deletedCategories.length === 0) {
    response
      .status(BAD_REQUEST)
      .json("Aucune catégorie à supprimer");
  } else {
    logger.info(`Trying to delete categories from database`);
    const promiseTab = [];
    for (let i = 0; i < deletedCategories.length; i++) {
      if (
        checkUUID(deletedCategories[i]) &&
        await categoryIdIsExisting(deletedCategories[i]) &&
        !await categoryIsUsed(deletedCategories[i])
      ) {
        promiseTab.push(deleteCategoryIngredient(deletedCategories[i]));
      }
    }

    await Promise.all(promiseTab);

    logger.info(`Trying to get all categories`);
    const categories = await getAllCategories();
    response.status(OK).json(categories);
  }
})

module.exports = categoriesRouterV2;