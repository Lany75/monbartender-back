const express = require("express");

const logger = require("../../helpers/logger");

const {
  getAllCocktails,
  getAllNameCocktails,
  getOneIdCocktail
} = require('../../controllers/v2/cocktails_controller_v2');

const cocktailsRouterV2 = express.Router();

cocktailsRouterV2.get('/', async (request, response) => {

  logger.info(`Trying to get all cocktails`);
  const cocktails = await getAllCocktails();

  response.status(200).json(cocktails);
})

cocktailsRouterV2.get(
  '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  async (request, response) => {
    const { id } = request.params;

    logger.info(`Trying to get cocktail with id=${id}`);
    const cocktail = await getOneIdCocktail(id);
    response.status(200).json(cocktail);

  })

cocktailsRouterV2.get('/:name', async (request, response) => {
  const { name } = request.params;
  logger.info(`Trying to get cocktail ${name}`);
  const cocktails = await getAllNameCocktails(name);
  response.status(200).json(cocktails);
})

module.exports = cocktailsRouterV2;