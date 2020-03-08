const express = require("express");

const ingredientRouter = express.Router();

ingredientRouter.get("/ingredient/:id", async (request, response) => {
{id} = request.params;
  const ingredient = await recupererUnIngredient(id);
});

ingredientRouter.post('/', async (request, response) => {

});

ingredientRouter.delete('/', async (require, response) => {

});

module.exports = ingredientRouter;