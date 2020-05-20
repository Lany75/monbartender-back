const express = require("express");
//const verifyToken = require("../middlewares/verify_token");
//const isAuthenticated = require("../middlewares/is_authenticated");

const { recupererLesVerres } = require("../controllers/verres_controller");
const { OK } = require("../helpers/status_code");

const verresRouter = express.Router();

/**
 * @swagger
 * /api/v1/verres:
 *   get:
 *     tags:
 *       - Verres
 *     description: Retourne la liste de tous les verres
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de verres
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Verre'
 *       404:
 *         description: Aucun verres n'existe
 */

verresRouter.get("/", async (request, response) => {
  logger.info(`Trying to get all glasses`);
  const verres = await recupererLesVerres();

  if (!verres) {
    logger.info(`Glasses not found`);
    response.statut(NOT_FOUND);
    response.json("La liste des verres n'a pas été récupérée");
  }
  logger.info(`Glasses found`);
  response.status(OK).json(verres);
});

module.exports = verresRouter;
