const express = require("express");

const {
  recupererLesCocktails,
  recupererUnCocktail,
  recupererLesCocktailsDuMoment
} = require("../controllers/cocktails_controller");
const {
  rechercherUnCocktailParSonNom,
  rechercherCocktailsParIngredients
} = require("../controllers/recherche_controller");
const {
  recupererIdIngredient
} = require("../controllers/ingredients_controller");

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

cocktailsRouter.get("/rechercherparnom", async (request, response) => {
  console.log("on est sur la route /rechercherparnom");
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

cocktailsRouter.get("/rechercherparingredient", async (request, response) => {
  console.log("on est sur la route /rechercherparingredient");
  const { ingredient1, ingredient2, ingredient3 } = request.query;
  let idIngredient1, cocktailsIngredient1;
  let idIngredient2, cocktailsIngredient2;
  let idIngredient3, cocktailsIngredient3;
  const cocktails = [];

  if (ingredient1 === "" && ingredient2 === "" && ingredient3 === "") {
    response.status(NOT_FOUND).json("Pas d'ingrédient, pas de cocktails");
  }

  if (!ingredient1 && !ingredient2 && !ingredient3) {
    response.status(NOT_FOUND).json("Pas d'ingrédient, pas de cocktails");
  }

  if (ingredient1) {
    idIngredient1 = await recupererIdIngredient(ingredient1);
    if (idIngredient1 === "0")
      response.status(NOT_FOUND).json("l'ingredient1 n'existe pas");
    cocktailsIngredient1 = await rechercherCocktailsParIngredients(
      idIngredient1
    );
  }

  if (ingredient2) {
    idIngredient2 = await recupererIdIngredient(ingredient2);
    if (idIngredient2 === "0")
      response.status(NOT_FOUND).json("l'ingredient2 n'existe pas");
    cocktailsIngredient2 = await rechercherCocktailsParIngredients(
      idIngredient2
    );
  }

  if (ingredient3) {
    idIngredient3 = await recupererIdIngredient(ingredient3);
    if (idIngredient3 === "0")
      response.status(NOT_FOUND).json("l'ingredient2 n'existe pas");
    cocktailsIngredient3 = await rechercherCocktailsParIngredients(
      idIngredient3
    );
  }

  const tableauCocktails = [];

  if (idIngredient1) {
    cocktailsIngredient1.map(ci1 => {
      tableauCocktails.push(ci1.dataValues.cocktailId);
    });
  }
  if (idIngredient2) {
    cocktailsIngredient2.map(ci2 => {
      tableauCocktails.push(ci2.dataValues.cocktailId);
    });
  }
  if (idIngredient3) {
    cocktailsIngredient3.map(ci3 => {
      tableauCocktails.push(ci3.dataValues.cocktailId);
    });
  }

  const tableauCocktailsUnique = new Set(tableauCocktails);
  const tabIdResultat = [...tableauCocktailsUnique];

  for (let i = 0; i < tabIdResultat.length; i++) {
    cocktailProvisoire = await recupererUnCocktail(tabIdResultat[i]);
    cocktails.push({
      id: tabIdResultat[i],
      nom: cocktailProvisoire.dataValues.nom,
      photo: cocktailProvisoire.dataValues.photo
    });
  }

  response.status(OK).json(cocktails);
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
