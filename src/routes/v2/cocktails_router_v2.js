const express = require("express");

const logger = require("../../helpers/logger");

const {
  getAllCocktails
} = require('../../controllers/v2/cocktails_controller_v2');

const cocktailsRouterV2 = express.Router();

cocktailsRouterV2.get('/', async (request, response) => {

  logger.info(`Trying to get all cocktails`);
  const cocktails = await getAllCocktails();

  response.status(200).json(cocktails);
})

module.exports = cocktailsRouterV2;