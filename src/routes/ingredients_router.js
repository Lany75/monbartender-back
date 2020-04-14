const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const {
  recupererLesIngredients,
  recupererIdIngredient,
  ajouterUnIngredientDB
} = require("../controllers/ingredients_controller");

const {
  recupererIdBar,
  ajouterUnIngredientAuBar,
  recupererUnBar,
  supprimerUnIngredientDuBar
} = require("../controllers/bars_controller");

const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND
} = require("../helpers/status_code");

const ingredientRouter = express.Router();

ingredientRouter.get("/", async (request, response) => {
  const ingredients = await recupererLesIngredients();

  response.status(OK);
  response.json(ingredients);
});

ingredientRouter.post("/ajouter", verifyToken, async (request, response) => {
  const mail = request.body.email;
  const nomNouvelIngredient = request.query.ingredient;

  let idIngredient = await recupererIdIngredient(nomNouvelIngredient);
  const idBar = await recupererIdBar(mail);

  try {
    await ajouterUnIngredientAuBar(idIngredient, idBar);
  } catch {
    const bar = await recupererUnBar(mail);
    response.status(BAD_REQUEST);
  }

  const bar = await recupererUnBar(mail);

  response.status(CREATED).json(bar);
});

ingredientRouter.delete(
  "/supprimer",
  verifyToken,
  async (request, response) => {
    const mail = request.body.email;
    const nomIngredientSupprime = request.query.ingredient;

    const idIngredient = await recupererIdIngredient(nomIngredientSupprime);
    const idBar = await recupererIdBar(mail);

    await supprimerUnIngredientDuBar(idIngredient, idBar);

    const bar = await recupererUnBar(mail);
    response.status(OK).json(bar);
  }
);

module.exports = ingredientRouter;
