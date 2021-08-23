const express = require("express");

const isAuthenticated = require("../../middlewares/is_authenticated");

const logger = require("../../helpers/logger");

const {
  getUserBar,
  createUserBar
} = require("../../controllers/v2/bars_controller_v2");

const {
  OK
} = require("../../helpers/status_code");

const barsRouterV2 = express.Router();

barsRouterV2.get("/", isAuthenticated, async (request, response) => {
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

module.exports = barsRouterV2;
