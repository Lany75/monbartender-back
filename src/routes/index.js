const express = require("express");

const cocktailsRouter = require("./cocktails_router");
const barsRouter = require("./bars_router");

const mainRouter = express.Router();

mainRouter.use("/cocktails", cocktailsRouter);
mainRouter.use("/bars", barsRouter);

module.exports = mainRouter;
