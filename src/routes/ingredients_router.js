const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const {
  recupererLesIngredients,
  recupererIdIngredient
} = require("../controllers/ingredients_controller");

const {
  recupererIdBar,
  ajouterUnIngredient
} = require("../controllers/bars_controller");

const ingredientRouter = express.Router();

ingredientRouter.get("/", async (request, response) => {
  const ingredients = await recupererLesIngredients();

  response.status(200);
  response.json(ingredients);
});

/*ingredientRouter.get("/ingredient/:id", async (request, response) => {
{id} = request.params;
  const ingredient = await recupererUnIngredient(id);
});*/

ingredientRouter.post("/", verifyToken, async (request, response) => {
  console.log("on est sur la route POST ingredient/");
  /*console.log(
    "request.headers.nouvelIngredient : ",
    request.headers.nouvelingredient
  );*/
  //console.log("request.body : ", request.body);
  const mail = request.body.email;
  const nomNouvelIngredient = request.headers.nouvelingredient;
  //console.log("nouvelIngredient : ", nomNouvelIngredient);

  const idIngredient = await recupererIdIngredient(nomNouvelIngredient);
  console.log("idIngredient : ", idIngredient[0].dataValues.id);
  const idBar = await recupererIdBar(mail);
  console.log("idBar", idBar[0].dataValues.id);

  ajouterUnIngredient(idIngredient[0].dataValues.id, idBar[0].dataValues.id);

  const bars = await recupererUnBar(mail);
  console.log("bars : ", bars);

  //console.log("idIngredient : ", idIngredient);

  //console.log("request.body.name : ", request.body.name);
  response.status(201).json(bars);
});

/*
ingredientRouter.delete('/', async (require, response) => {

});*/

module.exports = ingredientRouter;
