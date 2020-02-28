const express = require("express");

const {
  recupererLesCocktails,
  recupererUnCocktail,
  recupererLesCocktailsDuMoment
} = require("../controllers/cocktails_controller");

const cocktailsRouter = express.Router();

cocktailsRouter.get("/", async (request, response) => {
  const cocktails = await recupererLesCocktails();

  response.status(200);
  response.json(cocktails);
});

cocktailsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const cocktail = await recupererUnCocktail(id);

  response.status(200);
  response.json(cocktail);
});

module.exports = cocktailsRouter;
