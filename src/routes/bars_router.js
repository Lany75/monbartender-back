require("dotenv").config();
const express = require("express");
const verifyToken = require("../middlewares/verify_token");

const {
  recupererLesBars,
  recupererUnBar,
  ajouterUnIngredient,
  recupererIdBar,
  creerUnBar
} = require("../controllers/bars_controller");

const {
  recupererIdIngredient
} = require("../controllers/ingredients_controller");

const { OK, NOT_FOUND } = require("../helpers/status_code");

const barsRouter = express.Router();

/*barsRouter.get("/", async (request, response) => {
  console.log("on est sur la route /bars/");

  const bars = await recupererLesBars();

  response.status(200);
  response.json(bars);
});*/

barsRouter.get("/", verifyToken, async (request, response) => {
  console.log("route recupererUnBar");
  //console.log("request.body : ", request.body);
  //console.log("request.headers", request.headers);
  //console.log("request.body", request.body);
  const mail = request.body.email;
  // console.log("mail : ", mail);

  let bar = await recupererIdBar(mail);
  console.log("bar : ", bar);

  if (!bar || bar.length === 0) {
    console.log("creation d'un bar");

    await creerUnBar(mail);
  }
  bar = await recupererUnBar(mail);
  console.log("bar : ", bar);

  if (!bar) response.status(NOT_FOUND).json("Le bar n'a pas été trouvé");

  response.status(OK);
  response.json(bar);
});

/*barsRouter.post("/", verifyToken, async (request, response) => {
  console.log("route /bar/connexion");
  console.log("request.body", request.body);

  const mail = request.body.email;
  const user = await recupererIdBar(mail);
  console.log("user : ", user.length);
  if (user.length === 0) {
    console.log("user inexistant");
    await creerUnBar(mail);
    response.status(201).json(mail);
  } else console.log("user : ", user[0].dataValues.id);

  response.status(201);
  response.json(mail);
});*/

/*barsRouter.post("/", verifyToken, async (request, response) => {
  console.log("route ajouterUnIngredient");
  console.log("request.body", request.body);
  mail = request.body.email;
  console.log("mail", mail);*/

//const { mail } = request.params;
/*let { ingredient } = request.body;
  ingredient = ingredient.toLowerCase();
  console.log("ingredient : ", ingredient);

  const user = await recupererIdBar(mail);
  const userId = user[0].dataValues.id;

  const ingr = await recupererIdIngredient(ingredient);
  const ingredientId = ingr[0].dataValues.id;

  await ajouterUnIngredient(ingredientId, userId);

  response.status(201);
  response.json(ingredient);*/
//});

/*barsRouter.get("/:mail/ingredients", async (request, response) => {
  const { mail, name } = request.params;
});*/

/*barsRouter.delete("/", async (request, response) => {
  const bar = await supprimerUnIngredientDuBar(name);

  response.status(200);
  response.json(bar);
});*/

module.exports = barsRouter;
