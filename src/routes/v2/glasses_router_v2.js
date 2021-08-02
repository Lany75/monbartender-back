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
  OK, CREATED, BAD_REQUEST
} = require("../../helpers/status_code");

const camelCaseText = require('../../utils/camelCaseText');

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

    if (!nom || nom === '') {
      response
        .status(BAD_REQUEST)
        .json('Data missing for glass adding');
    } else {

      if (!await getIdGlass(camelCaseText(nom))) {
        logger.info(`Trying to add glass ${nom}`);
        try {
          await addGlass(camelCaseText(nom));
        } catch (error) {
          logger.error(
            `An error has occured while adding glass, message: ${error.message}`
          );
        }
      }

      logger.info(`Trying to get all glasses`);
      const glasses = await getAllGlasses();
      response
        .status(CREATED)
        .json(glasses);
    }
  })

glassesRouterV2.put(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom } = request.body;

    if (await glassIdIsExisting(id)) {
      if (!nom || nom === '') {
        response
          .status(BAD_REQUEST)
          .json("Data missing for glass modification");
      } else {
        logger.info(`Trying to get glass ${camelCaseText(nom)}`);
        const glass = await getNamedGlass(camelCaseText(nom));

        if (!glass || glass.id === id) {
          logger.info(`Trying to modify glass ${id}`);
          await putOneGlass(id, camelCaseText(nom));
        }
      }

      logger.info(`Trying to get all glasses`);
      const glasses = await getAllGlasses();
      response
        .status(OK)
        .json(glasses);

    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  }
)

glassesRouterV2.delete(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;

    if (await glassIdIsExisting(id)) {
      if (!await glassIsUsed(id)) {
        logger.info(`Trying to delete glass in verres table`);
        await deleteGlass(id);
      }

      const glasses = await getAllGlasses();
      response
        .status(OK)
        .json(glasses);
    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  }
)

module.exports = glassesRouterV2;