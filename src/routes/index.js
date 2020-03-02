const express = require("express");

const cocktailsRouter = require("./cocktails_router");
const authRouter = require("./auth_router");

const mainRouter = express.Router();

mainRouter.use("/cocktails", cocktailsRouter);
mainRouter.use("/auth", authRouter);

module.exports = mainRouter;
