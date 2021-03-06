const express = require("express");

const cocktailsRouter = require("./cocktails_router");
const barsRouter = require("./bars_router");
const ingredientsRouter = require("./ingredients_router");
const verresRouter = require("./verres_router");
const gestionRouter = require("./gestion_router");

const cocktailsRouterV2 = require('./v2/cocktails_router_v2');
const ingredientsRouterV2 = require('./v2/ingredients_router_v2');

const mainRouter = express.Router();

mainRouter.use("/api/v1/cocktails", cocktailsRouter);
mainRouter.use("/api/v1/bars", barsRouter);
mainRouter.use("/api/v1/ingredients", ingredientsRouter);
mainRouter.use("/api/v1/verres", verresRouter);
mainRouter.use("/api/v1/gestion", gestionRouter);

mainRouter.use('/api/v2/cocktails', cocktailsRouterV2);
mainRouter.use('/api/v2/ingredients', ingredientsRouterV2);


mainRouter.use("*", (req, res) => {
  res.status(404).json("Tu t'es perdu !!!");
});

//pour le test de branche

module.exports = mainRouter;
