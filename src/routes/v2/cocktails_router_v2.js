const express = require("express");

const logger = require("../../helpers/logger");

const {
  getAllCocktails,
  getAllNameCocktails,
  getOneIdCocktail,
  searchCocktail,
  postCocktail
} = require('../../controllers/v2/cocktails_controller_v2');
const { getMomentCocktailIds } = require("../../controllers/v2/cocktailsMoment_controller_v2");
const { getIdGlass } = require("../../controllers/v2/glasses_controller_v2");
const { bindCocktailIngredient } = require("../../controllers/v2/cocktailsIngredients_controller_v2");
const { addStep } = require("../../controllers/v2/step_controller_v2");

const cocktailsRouterV2 = express.Router();

cocktailsRouterV2.get('/', async (request, response) => {

  logger.info(`Trying to get all cocktails`);
  const cocktails = await getAllCocktails();

  response.status(200).json(cocktails);
})

cocktailsRouterV2.post('/', async (request, response) => {
  const { nomCocktail, type, image, nomVerre, ingredients, etapes } = request.body;

  console.log({ nomCocktail, type, image, nomVerre, ingredients, etapes });

  logger.info(`Trying to get verre's id of ${nomVerre}`);
  const idVerre = await getIdGlass(nomVerre);

  logger.info(`Trying to add cocktail ${nomCocktail}`);
  const idCocktail = await postCocktail(
    nomCocktail,
    image,
    idVerre,
    type
  );

  console.log(idCocktail);

  for (let i = 0; i < ingredients.length; i++) {
    console.log(ingredients[i]);

    logger.info(
      `Trying to bind cocktail ${nomCocktail} with ingredient ${ingredients[i].ingredient}}`
    );
    await bindCocktailIngredient(
      idCocktail,
      ingredients[i].id,
      ingredients[i].quantite,
      ingredients[i].unite
    );
  }

  for (let e = 0; e < etapes.length; e++) {
    console.log(etapes[e]);
    logger.info(`Trying to add step ${e + 1}`);
    const idEtape = await addStep(etapes[e].id, etapes[e].etape, etapes[e].libelle, idCocktail);
  }

  const cocktails = await getAllCocktails();

  response.status(201);
  response.json(cocktails);
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