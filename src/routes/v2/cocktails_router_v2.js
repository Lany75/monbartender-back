const express = require("express");

const logger = require("../../helpers/logger");

const {
  getAllCocktails,
  getAllNameCocktails,
  getOneIdCocktail,
  searchCocktail
} = require('../../controllers/v2/cocktails_controller_v2');
const {
  getMomentCocktailIds
} = require("../../controllers/v2/cocktailsMoment_controller_v2");

const cocktailsRouterV2 = express.Router();

cocktailsRouterV2.get('/', async (request, response) => {

  logger.info(`Trying to get all cocktails`);
  const cocktails = await getAllCocktails();

  response.status(200).json(cocktails);
})

cocktailsRouterV2.get('/moment-cocktail', async (request, response) => {
  const cocktailsMoment = [];

  logger.info(`Trying to get id of cocktails of the day`);
  const idCocktailsMoment = await getMomentCocktailIds();

  logger.info(`Cocktails of the day list has been found`);
  for (let i = 0; i < idCocktailsMoment.length; i++) {
    const cocktail = await getOneIdCocktail(idCocktailsMoment[i].cocktailId);

    cocktailsMoment.push({
      id: idCocktailsMoment[i].cocktailId,
      nom: cocktail.dataValues.nom,
      photo: cocktail.dataValues.photo
    });
  }

  response.status(200);
  response.json(cocktailsMoment);
})

cocktailsRouterV2.post('/search', async (request, response) => {
  const { ingredients, typeCocktail } = request.body;

  console.log(ingredients);
  console.log(typeCocktail);

  logger.info(`Trying to get all cocktails with ingredients`);
  const cocktails = await searchCocktail(ingredients, typeCocktail);

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