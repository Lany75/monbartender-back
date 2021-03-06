const express = require("express");
const logger = require("../helpers/logger");

const isAuthenticated = require("../middlewares/is_authenticated");
const haveRight = require("../middlewares/haveRight");

const {
  recupererLesVerres,
  recupererUnVerre,
  modifierUnVerre,
  verreExistant,
  ajouterVerresDB,
  supprimerUnVerre,
  verificationVerreUtil
} = require("../controllers/verres_controller");

const { OK, NOT_FOUND, CREATED } = require("../helpers/status_code");

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
      response.status(OK).json([]);
    }
  }
);

/**
 * @swagger
 * /api/v1/verres/{id}:
 *   put:
 *     tags:
 *       - Verres
 *     description: modifie le nom du verre
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: identifiant du verre à modifier
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *         description: nouveau nom du verre
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nom:
 *                   type: string
 *     responses:
 *       200:
 *         description: Un verre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Verre'
 *       404:
 *         description: Aucun verre avec cet id
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
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

/**
 * @swagger
 * /api/v1/verres:
 *   post:
 *     tags:
 *       - Verres
 *     description: Ajoute un nouveau verre à la base de données
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: nom
 *         description: nom du verre ajouté
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Création du verre réussi, retourne la nouvelle liste de verre
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
verresRouter.post(
  "/",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    let nomVerre = request.query.nom;
    let exist = false;

    // Mise en majuscule de la 1ere lettre du nom
    nomVerre = nomVerre.replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );

    //vérification de l'inexistance du verre dans la liste
    exist = await verreExistant(nomVerre);

    if (exist === false) {
      logger.info(`Adding glasses in database`);
      await ajouterVerresDB(nomVerre);

      logger.info(`Trying to get list of glasses`);
      const listeVerres = await recupererLesVerres();

      response.status(CREATED);
      response.json(listeVerres);
    } else {
      logger.info("The glass already exist in database");
      logger.info(`Trying to get list of glasses`);
      const listeVerres = await recupererLesVerres();

      response.status(OK);
      response.json(listeVerres);
    }
  }
);

/**
 * @swagger
 * /api/v1/verres/{id}:
 *   delete:
 *     tags:
 *       - Verres
 *     description: Supprime un verre à partir de son id
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
 *         description: Suppression du verre réussi, retourne la nouvelle liste de verre
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Suppression impossible à réaliser
 *     security:
 *         - googleAuth:
 *            - email
 *            - openid
 *            - profile
 */
verresRouter.delete(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  isAuthenticated,
  haveRight,
  async (request, response) => {
    const idVerre = request.params.id;

    // vérification de l'inutilité du verre avant sa suppression
    logger.info("Verify utility of glass");
    const verreUtil = await verificationVerreUtil(idVerre);

    if (verreUtil === false) {
      logger.info(
        `Trying to remove the glass with id ${idVerre} from database`
      );
      await supprimerUnVerre(idVerre);
    } else {
      logger.info(
        `delete forbidden, glass with id ${idVerre} is used in a cocktail`
      );
    }

    logger.info(`Trying to get list of glasses`);
    const listeVerres = await recupererLesVerres();

    response.status(OK);
    response.json(listeVerres);
  }
);

module.exports = verresRouter;
