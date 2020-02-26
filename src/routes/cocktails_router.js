const express = require("express");

const {
  recupererLesCocktails
} = require("../controllers/cocktails_controller");

const cocktailsRouter = express.Router();

cocktailsRouter.get("/", async (request, response) => {
  const cocktails = await recupererLesCocktails();

  response.status(200);
  response.json(cocktails);
});

module.exports = cocktailsRouter;
