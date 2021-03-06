const express = require("express");

const logger = require("../helpers/logger");
const { OK, NOT_FOUND, BAD_REQUEST } = require("../helpers/status_code");

const {
  estDansLaTableCocktail,
  recupererLesCocktails,
  recupererUnCocktail,
  rechercherUnCocktailParSonNom,
  rechercherCocktailsParIngredients
} = require("../controllers/cocktails_controller");
const {
  recupererIdCocktailsMoment
} = require("../controllers/cocktailsMoment_controller");
const {
  recupererQuantiteIngredient,
  recupererIngredientsCocktails
} = require("../controllers/cocktailsIngredients_controller");
const {
  recupererNomIngredient
} = require("../controllers/ingredients_controller");

const cocktailsRouter = express.Router();

/**
 * @swagger
 * /api/v1/cocktails:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Retourne la liste de tous les cocktails
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: alcool
 *         schema:
 *           type: string
 *         required: true
 *         description: l'alcool du cocktail (true, false, indifferent)
 *     responses:
 *       200:
 *         description: Un tableau de cocktails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get("/", async (request, response) => {
  const { alcool } = request.query;
  const resultatCocktail = [];

  if (!alcool) {
    logger.info(`Alcool variable is not defined`);
    response.status(BAD_REQUEST);
    response.json("La variable alcool n'est pas définie");
  } else {
    if (alcool !== "true" && alcool !== "false" && alcool !== "indifferent") {
      logger.info(`Alcool variable's value is not the good one`);
      response.status(BAD_REQUEST);
      response.json("La valeur de la variable alcool n'est pas celle attendue");
    } else {
      logger.info(`Trying to get all cocktails`);
      const cocktails = await recupererLesCocktails(alcool);
      logger.info(`Trying to get all cocktails ingredients`);
      const cocktailsIngredients = await recupererIngredientsCocktails();

      for (let i = 0; i < cocktails.length; i++) {
        const ingredientCocktail = [];
        for (let j = 0; j < cocktailsIngredients.length; j++) {
          if (cocktails[i].id === cocktailsIngredients[j].cocktailId) {
            ingredientCocktail.push({
              id: cocktailsIngredients[j].ingredientId,
              nom: await recupererNomIngredient(
                cocktailsIngredients[j].ingredientId
              ),
              quantite: cocktailsIngredients[j].quantite,
              unite: cocktailsIngredients[j].unite
            });
          }
        }

        resultatCocktail.push({
          id: cocktails[i].id,
          nom: cocktails[i].nom,
          photo: cocktails[i].photo,
          verre: cocktails[i].verreId,
          alcool: cocktails[i].alcool,
          ingredient: ingredientCocktail
        });
      }

      logger.info(`Cocktails list has been found`);
      response.status(OK);
      response.json(resultatCocktail);
    }
  }
});

/**
 * @swagger
 * /api/v1/cocktails/cocktail-du-moment:
 *   get:
 *     tags:
 *       - Cocktail du moment
 *     description: Retourne la liste des cocktails du moment
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un tableau de cocktails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get("/cocktail-du-moment", async (request, response) => {
  const cocktailsMoment = [];

  logger.info(`Trying to get id of cocktails of the day`);
  const idCocktailsMoment = await recupererIdCocktailsMoment();

  logger.info(`Cocktails of the day list has been found`);
  for (let i = 0; i < idCocktailsMoment.length; i++) {
    const cocktail = await recupererUnCocktail(idCocktailsMoment[i].cocktailId);

    cocktailsMoment.push({
      id: idCocktailsMoment[i].cocktailId,
      nom: cocktail.dataValues.nom,
      photo: cocktail.dataValues.photo
    });
  }

  response.status(OK);
  response.json(cocktailsMoment);
});

/**
 * @swagger
 * /api/v1/cocktails/rechercher-par-nom:
 *   get:
 *     tags:
 *       - Recherche cocktail
 *     description: Recherche une liste de cocktails à partir d'un nom
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         required: true
 *         description: le nom du cocktail recherché
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       400:
 *         description : Le nom du cocktail n'est pas renseigné
 *       404:
 *         description: Aucun cocktail n'existe
 */

cocktailsRouter.get("/rechercher-par-nom", async (request, response) => {
  const { nom } = request.query;

  if (!nom) {
    logger.info(`Cocktail's name is not given`);
    response.status(BAD_REQUEST);
    response.json("Un nom de cocktail est obligatoire");
  } else {
    logger.info(`Trying to get cocktails that match ${nom}`);
    const cocktail = await rechercherUnCocktailParSonNom(nom);

    if (cocktail.length === 0) {
      logger.info("No cocktail with this name");
    } else {
      logger.info(`Cocktail has been found`);
    }
    response.status(OK);
    response.json(cocktail);
  }
});

/**
 * @swagger
 * /api/v1/cocktails/rechercher-par-ingredient:
 *   get:
 *     tags:
 *       - Recherche cocktail
 *     description: Recherche une liste de cocktails à partir d'ingrédients
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: ingredient1
 *         schema:
 *           type: string
 *         description: le nom d'un ingrédient
 *       - in: query
 *         name: ingredient2
 *         schema:
 *           type: string
 *         description: le nom d'un ingrédient
 *       - in: query
 *         name: ingredient3
 *         schema:
 *           type: string
 *         description: le nom d'un ingrédient
 *       - in: query
 *         name: alcool
 *         schema:
 *           type: string
 *         description: alcool du cocktail (true, false, indifferent)
 *     responses:
 *       200:
 *         description: Un tableau de cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       404:
 *         description: Aucun cocktail trouvé
 */

cocktailsRouter.get("/rechercher-par-ingredient", async (request, response) => {
  const { ingredient1, ingredient2, ingredient3, alcool } = request.query;
  const tableauIngredient = [ingredient1, ingredient2, ingredient3];
  const tableauCocktails = [];

  if (!alcool) {
    logger.info(`Alcool variable is not defined`);
    response.status(BAD_REQUEST);
    response.json("La variable alcool n'est pas définie");
  } else {
    logger.info(
      `Trying to get cocktails with ingredients ${ingredient1}, ${ingredient2}, ${ingredient3}`
    );
    const cocktails = await rechercherCocktailsParIngredients(
      tableauIngredient,
      alcool
    );

    cocktails.map(cocktail => {
      tableauCocktails.push({
        id: cocktail.dataValues.id,
        nom: cocktail.dataValues.nom,
        photo: cocktail.dataValues.photo
      });
    });

    if (tableauCocktails.length === 0) {
      logger.info(`No cocktails found for this search`);
      response.status(OK).json(tableauCocktails);
    } else {
      logger.info(`Cocktails found, remove duplicate`);
      const tableauCocktailsUnique = new Set(tableauCocktails);
      const sortedCocktails = [...tableauCocktailsUnique];

      response.status(OK).json(sortedCocktails);
    }
  }
});

/**
 * @swagger
 * /api/v1/cocktails/{id}:
 *   get:
 *     tags:
 *       - Cocktails
 *     description: Recherche un cocktail à partir de son id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: identifiant du cocktail
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un cocktail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cocktail'
 *       400:
 *         description : L'id du cocktail n'est pas renseigné
 *       404:
 *         description: Aucun cocktail n'existe
 */
cocktailsRouter.get(
  "/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})",
  async (request, response) => {
    const { id } = request.params;
    let resultatCocktail = {
      id: "",
      nom: "",
      photo: "",
      verre: { id: "", nom: "" },
      ingredients: [],
      etapesPreparation: []
    };

    logger.info(`Verifying cocktail with id ${id} exist`);
    const exist = await estDansLaTableCocktail(id);

    if (exist === false) {
      logger.info(`Cocktail with id ${id} doesn't exist`);
      response.status(OK);
      response.json([]);
    } else {
      logger.info(
        `Trying to get cocktail with id ${id} and his ingredient's quantity`
      );
      const cocktail = await recupererUnCocktail(id);
      const quantiteIngredient = await recupererQuantiteIngredient(id);

      resultatCocktail.id = id;
      resultatCocktail.nom = cocktail.dataValues.nom;
      resultatCocktail.photo = cocktail.dataValues.photo;
      resultatCocktail.verre = {
        id: cocktail.dataValues.Verre.id,
        nom: cocktail.dataValues.Verre.nom
      };

      cocktail.dataValues.Ingredients.map((i, index) => {
        quantiteIngredient.map((qi, index) => {
          if (i.dataValues.id === qi.dataValues.ingredientId)
            resultatCocktail.ingredients.push({
              id: i.dataValues.id,
              nom: i.dataValues.nom,
              quantite: qi.dataValues.quantite,
              unite: qi.dataValues.unite
            });
        });
      });
      cocktail.dataValues.EtapesPreparations.map((ep, index) => {
        resultatCocktail.etapesPreparation.push({
          numEtape: ep.dataValues.numEtape,
          texte: ep.dataValues.texte
        });
      });

      logger.info(`Cocktail found`);
      response.status(OK);
      response.json(resultatCocktail);
    }
  }
);

module.exports = cocktailsRouter;
