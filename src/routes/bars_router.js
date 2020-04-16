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

barsRouter.get("/", verifyToken, async (request, response) => {
  const mail = request.body.email;

  let bar = await recupererIdBar(mail);

  if (!bar || bar.length === 0) {
    await creerUnBar(mail);
  }
  bar = await recupererUnBar(mail);

  if (!bar) response.status(NOT_FOUND).json("Le bar n'a pas été trouvé");

  response.status(OK);
  response.json(bar);
});

module.exports = barsRouter;
