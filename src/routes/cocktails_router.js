const express = require("express");

const {
  recupererLesCocktails,
  recupererUnCocktail,
  recupererLesCocktailsDuMoment
} = require("../controllers/cocktails_controller");

const {
  rechercherUnCocktailParSonNom
} = require("../controllers/recherche_controller");

const { OK, NOT_FOUND } = require("../helpers/status_code");

const cocktailsRouter = express.Router();

cocktailsRouter.get("/", async (request, response) => {
  console.log("route recuperer tous les cocktails");

  const cocktails = await recupererLesCocktails();

  if (!cocktails) {
    response
      .status(NOT_FOUND)
      .json("La liste de cocktail n'a pas été récupérée");
  }

  response.status(OK);
  response.json(cocktails);
});

cocktailsRouter.get("/aleatoire", async (request, response) => {
  const cocktails = await recupererLesCocktailsDuMoment();

  if (!cocktails) {
    response
      .status(NOT_FOUND)
      .json("La liste de cocktail n'a pas été récupérée");
  }

  response.status(OK);
  response.json(cocktails);
});

cocktailsRouter.get("/rechercher", async (request, response) => {
  console.log("on est sur la route /rechercher");
  const { nom } = request.query;
  //console.log("nom :", nom);

  const cocktail = await rechercherUnCocktailParSonNom(nom);

  if (!cocktail) {
    response.status(NOT_FOUND);
    response.json("Le cocktail n'a pas été trouvé");
  }

  response.status(OK);
  response.json(cocktail);
});

cocktailsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const cocktail = await recupererUnCocktail(id);

  if (!cocktail) {
    response.status(NOT_FOUND);
    response.json("Le cocktail n'a pas été trouvé");
  }

  response.status(OK);
  response.json(cocktail);
});

module.exports = cocktailsRouter;
