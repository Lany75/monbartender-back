const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");
const logger = require("../../helpers/logger");

const { getUserBar } = require("../../controllers/v2/bars_controller_v2");
const { deleteIngredientFromUserBar } = require("../../controllers/v2/barsIngredients_controller_v2");

const { BAD_REQUEST, OK } = require("../../helpers/status_code");

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
      deletedIngredients.forEach(async element => {
        await deleteIngredientFromUserBar(element, bar.dataValues.id);
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

module.exports = barsIngredientsRouterV2;