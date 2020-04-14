const express = require("express");

const cocktailsRouter = require("./cocktails_router");
const barsRouter = require("./bars_router");
const ingredientsRouter = require("./ingredients_router");
const verresRouter = require("./verres_router");

const mainRouter = express.Router();

mainRouter.use("/cocktails", cocktailsRouter);
mainRouter.use("/bars", barsRouter);
mainRouter.use("/ingredients", ingredientsRouter);
mainRouter.use("/verres", verresRouter);

/* mainRouter.use("*", (req, res) => {
  res.status(404).json("Tu t'es perdu !!!");
}); */

module.exports = mainRouter;
