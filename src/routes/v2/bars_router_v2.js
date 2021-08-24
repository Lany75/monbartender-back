const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");
const haveRight = require("../../middlewares/haveRight");

const logger = require("../../helpers/logger");

const {
  getUserBar,
  createUserBar,
  getAllBars,
  modifyUserRight
} = require("../../controllers/v2/bars_controller_v2");

const {
  postIngredientInBar,
  ingredientAlreadyInBar
} = require('../../controllers/v2/barsIngredients_controller_v2');

const {
  idIsExisting
} = require('../../controllers/v2/ingredients_controller_v2');

const {
  OK, CREATED, BAD_REQUEST
} = require("../../helpers/status_code");

const barsRouterV2 = express.Router();

barsRouterV2.get('/', isAuthenticated, haveRight, async (request, response) => {
  logger.info(`Trying to get all bars`);
  let bars = await getAllBars();

  response.status(OK).json(bars);
})

barsRouterV2.get('/user', isAuthenticated, async (request, response) => {
  const mail = request.user.email;

  logger.info(`Trying to get ${mail}'s bar`);
  let bar = await getUserBar(mail);

  if (!bar) {
    logger.info(`${mail}'s bar has not been found. Creating it!`);
    await createUserBar(mail);
    bar = await getUserBar(mail);
  }

  response.status(OK).json(bar);
})

barsRouterV2.put('/:mail', async (request, response) => {
  const { mail } = request.params;

  logger.info(`Trying to modify ${mail}'s rights `);
  await modifyUserRight(mail);

  let bars = await getAllBars();
  response.status(OK).json(bars);
})

barsRouterV2.post(
  '/:ingredientId([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  isAuthenticated,
  async (request, response) => {
    const { ingredientId } = request.params;
    const mail = request.user.email;

    if (await idIsExisting(ingredientId)) {
      logger.info(`Trying to get ${mail}'s bar`);
      let bar = await getUserBar(mail);

      if (bar) {
        logger.info(`Verifying ingredient not in user's bar`);
        if (!await ingredientAlreadyInBar(ingredientId, bar.dataValues.id)) {
          logger.info(`Trying to post ingredient in user's bar`);
          await postIngredientInBar(ingredientId, bar.dataValues.id);
        }

        bar = await getUserBar(mail);
        response.status(CREATED).json(bar);
      } else {
        response
          .status(BAD_REQUEST)
          .json("Bar inexistant");
      }
    } else {
      response
        .status(BAD_REQUEST)
        .json("Incorrect id");
    }
  })

module.exports = barsRouterV2;
