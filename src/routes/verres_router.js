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
const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");

const verresRouter = express.Router();

/**
 * @swagger
 * /api/v1/verres:
 *   get:
 *     tags:
 *       - Verres
 *     description: Retourne la liste de tous les verres enregistrés dans la base de données
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de verres
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Verre'
 */
verresRouter.get("/", async (request, response) => {
  logger.info(`Trying to get all glasses`);
  const verres = await recupererLesVerres();

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
 *         description: Aucun verre avec cet id
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
      response.status(NOT_FOUND).json([]);
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
    let verreExistant = false;

    // Vérification de l'inexistance du verre
    let verres = await recupererLesVerres();
    for (let i = 0; i < verres.length; i++) {
      if (verres[i].nom === nom && verres[i].id !== id) {
        verreExistant = true;
      }
    }

    if (nom !== "" && verreExistant === false) {
      logger.info("Trying to modify glass");
      await modifierUnVerre(id, nom);
    } else {
      logger.info("Modification not possible, the glass already exists");
    }

    verres = await recupererLesVerres();
    response.status(OK).json(verres);
  }
);

module.exports = verresRouter;
