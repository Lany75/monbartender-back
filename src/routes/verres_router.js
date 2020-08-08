const express = require("express");
const logger = require("../helpers/logger");
//const verifyToken = require("../middlewares/verify_token");
//const isAuthenticated = require("../middlewares/is_authenticated");

const {
  recupererLesVerres,
  recupererUnVerre,
  modifierUnVerre
} = require("../controllers/verres_controller");
const { OK, NOT_FOUND } = require("../helpers/status_code");
const { request, response } = require("express");
const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");

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

  /* if (!verres) {
    logger.info(`Glasses not found`);
    response.statut(NOT_FOUND);
    response.json("La liste des verres n'a pas été récupérée");
  } */

  logger.info(`Glasses found`);
  response.status(OK).json(verres);
});

/**
 * @swagger
 * /api/v1/verres/{id}:
 *   get:
 *     tags:
 *       - Verres
 *     description: Retourne le verre dont l'id est spécifié
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: identifiant du verre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un verre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Verre'
 *       404:
 *         description: Aucun verre n'existe avec cet id
 */
verresRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  async (request, response) => {
    const { id } = request.params;

    logger.info(`Trying to get glass with id ${id}`);
    const verre = await recupererUnVerre(id);

    if (verre) {
      logger.info("Glass found");
      response.status(OK).json(verre);
    } else {
      logger.info("Glass not found");
      response.status(OK).json([]);
    }
  }
);

verresRouter.put(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const { id } = request.params;
    const { nom } = request.body;

    if (nom !== "") await modifierUnVerre(id, nom);

    const verres = await recupererLesVerres();
    response.status(OK).json(verres);
  }
);

module.exports = verresRouter;
