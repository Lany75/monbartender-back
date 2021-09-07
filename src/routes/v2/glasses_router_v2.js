const express = require('express');

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getAllGlasses,
  getIdGlass,
  addGlass,
  glassIdIsExisting,
  deleteGlass,
  getNamedGlass,
  putOneGlass
} = require('../../controllers/v2/glasses_controller_v2');

const {
  glassIsUsed
} = require('../../controllers/v2/cocktails_controller_v2');

const {
  OK, CREATED, BAD_REQUEST, FORBIDDEN
} = require("../../helpers/status_code");

const camelCaseText = require('../../utils/camelCaseText');
const checkUUID = require('../../utils/checkUUID');

const glassesRouterV2 = express.Router();

glassesRouterV2.get('/', async (request, response) => {
  logger.info(`Trying to get all glasses`);
  const glasses = await getAllGlasses();
  response
    .status(OK)
    .json(glasses);
})

glassesRouterV2.post('/',
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
        .json('Data missing or glass name is not correct for adding');
    } else {
      if (await getIdGlass(camelCaseText(formatName))) {
        response
          .status(FORBIDDEN)
          .json(`A glass with name ${formatName} already exist`);
      } else {
        logger.info(`Trying to add glass ${formatName}`);
        try {
          await addGlass(camelCaseText(formatName));
        } catch (error) {
          logger.error(
            `An error has occured while adding glass, message: ${error.message}`
          );
        }
        logger.info(`Trying to get all glasses`);
        const glasses = await getAllGlasses();
        response
          .status(CREATED)
          .json(glasses);
      }
    }
  })

glassesRouterV2.put(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom } = request.body;

    if (!await glassIdIsExisting(id)) {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    } else {
      const formatName = nom?.replace(/\s+/g, ' ').trim();

      if (
        !(nom &&
          /\S/.test(formatName) &&
          formatName.length >= 2 &&
          formatName.length <= 30)
      ) {
        response
          .status(BAD_REQUEST)
          .json("Incorrect glass name");
      } else {
        logger.info(`Trying to get glass ${camelCaseText(formatName)}`);
        const glass = await getNamedGlass(camelCaseText(formatName));

        if (glass && glass.id !== id) {
          response
            .status(FORBIDDEN)
            .json(`Glass ${formatName} already exist in database`);
        } else {
          logger.info(`Trying to modify glass ${id}`);
          await putOneGlass(id, camelCaseText(formatName));
        }

        logger.info(`Trying to get all glasses`);
        const glasses = await getAllGlasses();
        response
          .status(OK)
          .json(glasses);
      }
    }
  }
)

glassesRouterV2.delete('/', isAuthenticated, haveRight, async (request, response) => {
  const { deletedGlasses } = request.body;

  if (!deletedGlasses || deletedGlasses.length === 0) {
    response
      .status(BAD_REQUEST)
      .json("Aucun verre à supprimer");
  } else {
    logger.info(`Trying to delete glasses from database`);
    const promiseTab = [];
    for (let i = 0; i < deletedGlasses.length; i++) {
      if (
        checkUUID(deletedGlasses[i]) &&
        await glassIdIsExisting(deletedGlasses[i]) &&
        !await glassIsUsed(deletedGlasses[i])
      ) {
        promiseTab.push(deleteGlass(deletedGlasses[i]));
      }
    }

    await Promise.all(promiseTab);

    logger.info(`Trying to get all glasses`);
    const glasses = await getAllGlasses();
    response.status(OK).json(glasses);

  }
})

module.exports = glassesRouterV2;