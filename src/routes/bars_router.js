const express = require("express");
const {
  recupererLesBars,
  recupererUnBar,
  ajouterUnIngredient
} = require("../controllers/bars_controller");

const barsRouter = express.Router();

barsRouter.get("/", async (request, response) => {
  const bars = await recupererLesBars();

  response.status(200);
  response.json(bars);
});

barsRouter.post("/ajouter", async (request, response) => {
  //console.log("request.body.ingredient : ", request.body.ingredient);
  const nouvelIngredient = await ajouterUnIngredient();

  response.status(201);
  response.json(nouvelIngredient);
});

barsRouter.get("/:mail", async (request, response) => {
  const { mail } = request.params;
  const bar = await recupererUnBar(mail);

  response.status(200);
  response.json(bar);
});

barsRouter.get("/:mail/ingredients", async (request, response) => {
  const { mail, name } = request.params;
});

barsRouter.delete("/:mail/ingredient?name=:name", async (request, response) => {
  const { name } = request.params;
  const bar = await supprimerUnIngredientDuBar(name);

  response.status(200);
  response.json(bar);
});

module.exports = barsRouter;
