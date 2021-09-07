const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");
const logger = require("../../helpers/logger");

const { getUserBar } = require("../../controllers/v2/bars_controller_v2");

const {
  postIngredientInUserBar,
  ingredientAlreadyInBar,
  deleteIngredientFromUserBar
} = require("../../controllers/v2/barsIngredients_controller_v2");

const {
  ingredientIdIsExisting
} = require('../../controllers/v2/ingredients_controller_v2');

const { BAD_REQUEST, OK, CREATED, FORBIDDEN } = require("../../helpers/status_code");

const checkUUID = require('../../utils/checkUUID');

const barsIngredientsRouterV2 = express.Router();

barsIngredientsRouterV2.delete('/', isAuthenticated, async (request, response) => {
  const mail = request.user.email;
  const { deletedIngredients } = request.body;

  if (!deletedIngredients || deletedIngredients.length === 0) {
    response
      .status(BAD_REQUEST)
      .json("Aucun ingrédient à supprimer");
  } else {
    logger.info(`Trying to get ${mail}'s bar`);
    let bar = await getUserBar(mail);

    if (bar) {
      logger.info(`Trying to delete ingredients from ${mail}'s bar`);
      deletedIngredients.forEach(element => {
        deleteIngredientFromUserBar(element, bar.dataValues.id);
      });

      bar = await getUserBar(mail);
      response.status(OK).json(bar);

    } else {
      response
        .status(BAD_REQUEST)
        .json("Bar inexistant");
    }
  }
})

barsIngredientsRouterV2.post('/', isAuthenticated, async (request, response) => {
  const mail = request.user.email;
  const { ingredientId } = request.body;

  if (
    !(ingredientId &&
      checkUUID(ingredientId) &&
      await ingredientIdIsExisting(ingredientId))
  ) {
    response
      .status(BAD_REQUEST)
      .json(`No ingredient to add to the ${mail}'s bar or incorrect id`);
  } else {
    logger.info(`Trying to get ${mail}'s bar`);
    let bar = await getUserBar(mail);

    if (!bar) {
      response
        .status(BAD_REQUEST)
        .json("Bar inexistant");
    } else {
      logger.info(`Verifying ingredient not in user's bar`);
      if (await ingredientAlreadyInBar(ingredientId, bar.dataValues.id)) {
        response
          .status(FORBIDDEN)
          .json(`Ingredient already exist in ${mail}'s bar `);
      } else {
        logger.info(`Trying to post ingredient in user's bar`);
        await postIngredientInUserBar(ingredientId, bar.dataValues.id);

        bar = await getUserBar(mail);
        response.status(CREATED).json(bar);
      }
    }
  }
})

module.exports = barsIngredientsRouterV2;
