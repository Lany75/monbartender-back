const express = require('express');

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getAllUnities,
  getIdUnity,
  addUnity,
  getNameOfUnity,
  unityIdIsExisting,
  deleteUnity,
  getNamedUnity,
  putOneUnity
} = require('../../controllers/v2/unities_controller_v2');

const { unityIsUsed } = require('../../controllers/v2/cocktailsIngredients_controller_v2');

const {
  OK, BAD_REQUEST, FORBIDDEN, CREATED
} = require("../../helpers/status_code");

const checkUUID = require('../../utils/checkUUID');

const unitiesRouterV2 = express.Router();

unitiesRouterV2.get('/', async (request, response) => {
  logger.info(`Trying to get all unities`);
  const unities = await getAllUnities();
  response
    .status(OK)
    .json(unities);
})

unitiesRouterV2.post('/',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { nom } = request.body;
    const formatName = nom?.replace(/\s+/g, ' ').trim();

    if (
      !(nom &&
        /\S/.test(formatName) &&
        formatName.length >= 1 &&
        formatName.length <= 30)
    ) {
      response
        .status(BAD_REQUEST)
        .json('Data missing or unity name is not correct for adding');
    } else {
      if (await getIdUnity(formatName)) {
        response
          .status(FORBIDDEN)
          .json(`An unity with name ${formatName} already exist`);
      } else {
        logger.info(`Trying to add unity ${formatName}`);
        try {
          await addUnity(formatName);
        } catch (error) {
          logger.error(
            `An error has occured while adding glass, message: ${error.message}`
          );
        }
        logger.info(`Trying to get all unities`);
        const unities = await getAllUnities();
        response
          .status(CREATED)
          .json(unities);
      }
    }
  }
)

unitiesRouterV2.delete('/', isAuthenticated, haveRight, async (request, response) => {
  const { deletedUnities } = request.body;

  if (!deletedUnities || deletedUnities.length === 0) {
    response
      .status(BAD_REQUEST)
      .json("Aucune unité à supprimer");
  } else {
    logger.info(`Trying to delete unities from database`);
    const promiseTab = [];
    for (let i = 0; i < deletedUnities.length; i++) {
      if (
        checkUUID(deletedUnities[i]) &&
        await unityIdIsExisting(deletedUnities[i])) {
        const unityName = await getNameOfUnity(deletedUnities[i]);
        if (!await unityIsUsed(unityName)) {
          promiseTab.push(deleteUnity(deletedUnities[i]));
        }
      }
    }

    await Promise.all(promiseTab);

    logger.info(`Trying to get all unities`);
    const unities = await getAllUnities();
    response.status(OK).json(unities);
  }
})

unitiesRouterV2.put(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom } = request.body;

    if (!await unityIdIsExisting(id)) {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    } else {
      const formatName = nom?.replace(/\s+/g, ' ').trim();

      if (
        !(nom &&
          /\S/.test(formatName) &&
          formatName.length >= 1 &&
          formatName.length <= 30)
      ) {
        response
          .status(BAD_REQUEST)
          .json("Incorrect unity name");
      } else {
        logger.info(`Trying to get unity ${formatName}`);
        const unity = await getNamedUnity(formatName);


        if (unity && unity.id !== id) {
          response
            .status(FORBIDDEN)
            .json(`Unity ${formatName} already exist in database`);
        } else {
          logger.info(`Trying to modify unity ${id}`);
          await putOneUnity(id, formatName);
        }

        logger.info(`Trying to get all unities`);
        const unities = await getAllUnities();
        response
          .status(OK)
          .json(unities);
      }
    }
  }
)

module.exports = unitiesRouterV2;