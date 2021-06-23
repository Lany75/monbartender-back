const express = require("express");

const logger = require("../../helpers/logger");

const {
  getAllCocktails,
  getAllNameCocktails
} = require('../../controllers/v2/cocktails_controller_v2');

const cocktailsRouterV2 = express.Router();

cocktailsRouterV2.get('/', async (request, response) => {

  logger.info(`Trying to get all cocktails`);
  const cocktails = await getAllCocktails();

  response.status(200).json(cocktails);
})

cocktailsRouterV2.get('/:name', async (request, response) => {
  const { name } = request.params;
  logger.info(`Trying to get cocktail ${name}`);
  const cocktails = await getAllNameCocktails(name);
  response.status(200).json(cocktails);
})

module.exports = cocktailsRouterV2;