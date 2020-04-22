const express = require("express");
//const verifyToken = require("../middlewares/verify_token");
//const isAuthenticated = require("../middlewares/is_authenticated");

const { recupererLesVerres } = require("../controllers/verres_controller");
const { OK } = require("../helpers/status_code");

const verresRouter = express.Router();

verresRouter.get("/", async (request, response) => {
  const verres = await recupererLesVerres();

  response.status(OK).json(verres);
});

module.exports = verresRouter;
