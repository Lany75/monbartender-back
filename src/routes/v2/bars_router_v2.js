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
  OK
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

barsRouterV2.put('/:mail', isAuthenticated, haveRight, async (request, response) => {
  const { mail } = request.params;

  logger.info(`Trying to modify ${mail}'s rights `);
  await modifyUserRight(mail);

  let bars = await getAllBars();
  response.status(OK).json(bars);
})

module.exports = barsRouterV2;
