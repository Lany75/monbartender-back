const express = require("express");

const {
  recupererLesCocktails,
  recupererUnCocktail,
  recupererLesCocktailsDuMoment
} = require("../controllers/cocktails_controller");

const {
  rechercherUnCocktailParSonNom
} = require("../controllers/recherche_controller");

const { OK } = require("../helpers/status_code");

const cocktailsRouter = express.Router();

cocktailsRouter.get("/", async (request, response) => {
  const cocktails = await recupererLesCocktails();

  response.status(OK);
  response.json(cocktails);
});

cocktailsRouter.get("/aleatoire", async (request, response) => {
  const cocktails = await recupererLesCocktailsDuMoment();

  response.status(OK);
  response.json(cocktails);
});

cocktailsRouter.get("/rechercher", async (request, response) => {
  console.log("on est sur la route /rechercher");
  const { nom } = request.query;
  //console.log("nom :", nom);

  const cocktail = await rechercherUnCocktailParSonNom(nom);

  response.status(OK);
  response.json(cocktail);
});

cocktailsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const cocktail = await recupererUnCocktail(id);

  response.status(OK);
  response.json(cocktail);
});

module.exports = cocktailsRouter;
