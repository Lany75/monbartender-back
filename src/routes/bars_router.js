require("dotenv").config();
const express = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const logger = require("../helpers/logger");

const {
  recupererUnBar,
  recupererIdBar,
  creerUnBar
} = require("../controllers/bars_controller");

const { OK, NOT_FOUND } = require("../helpers/status_code");

const barsRouter = express.Router();

/**
 * @swagger
 * /api/v1/bars:
 *   get:
 *     tags:
 *       - Bars
 *     description: Retourne le bar de l'utilisateur courant
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un bar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bar'
 *       401:
 *         description: Non autorisé
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
barsRouter.get("/", isAuthenticated, async (request, response) => {
  const mail = request.user.email;

  logger.info(`Trying to get ${mail}'s bar`);
  let bar = await recupererUnBar(mail);

  if (!bar || bar.length === 0) {
    logger.info(`${mail}'s bar has not been found. Creating it!`);
    bar = await creerUnBar(mail);
  }

  logger.info(`${mail}'s bar:${bar}`);
  response.status(OK);
  response.json(bar);
});

module.exports = barsRouter;
