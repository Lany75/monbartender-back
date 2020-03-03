const express = require("express");

const cocktailsRouter = require("./cocktails_router");

const mainRouter = express.Router();

mainRouter.use("/cocktails", cocktailsRouter);

module.exports = mainRouter;
