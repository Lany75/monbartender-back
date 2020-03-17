const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const {
  recupererLesIngredients,
  recupererIdIngredient
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

ingredientRouter.post("/", verifyToken, async (request, response) => {
  const mail = request.body.email;
  //const nomNouvelIngredient = request.body.nouvelingredient;
  const nomNouvelIngredient = request.headers.nouvelingredient;

  const idIngredient = await recupererIdIngredient(nomNouvelIngredient);
  const idBar = await recupererIdBar(mail);

  try {
    await ajouterUnIngredientAuBar(idIngredient, idBar);
  } catch {
    const bar = await recupererUnBar(mail);
    response.status(BAD_REQUEST);
    //.json(bar);
  }

  const bar = await recupererUnBar(mail);

  response.status(CREATED).json(bar);
});

ingredientRouter.delete("/", verifyToken, async (request, response) => {
  const mail = request.body.email;
  const nomIngredientSupprime = request.headers.ingredientsupprime;

  const idIngredient = await recupererIdIngredient(nomIngredientSupprime);
  console.log("idIngredient : ", idIngredient);
  const idBar = await recupererIdBar(mail);
  console.log("idBar : ", idBar);

  await supprimerUnIngredientDuBar(idIngredient, idBar);

  const bar = await recupererUnBar(mail);
  response.status(OK).json(bar);
});

module.exports = ingredientRouter;
