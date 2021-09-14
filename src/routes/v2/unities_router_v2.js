const express = require('express');

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getAllUnities,
  getIdUnity,
  addUnity
} = require('../../controllers/v2/unities_controller_v2');

const {
  OK, BAD_REQUEST, FORBIDDEN, CREATED
} = require("../../helpers/status_code");

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
  })


module.exports = unitiesRouterV2;