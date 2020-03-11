const express = require("express");

const cocktailsRouter = require("./cocktails_router");
const barsRouter = require("./bars_router");
const ingredientsRouter = require("./ingredients_router");

const mainRouter = express.Router();

mainRouter.use("/cocktails", cocktailsRouter);
mainRouter.use("/bars", barsRouter);
mainRouter.use("/ingredients", ingredientsRouter);

module.exports = mainRouter;
