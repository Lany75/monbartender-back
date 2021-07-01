const logger = require("../helpers/logger");
const { Bar } = require("../models");

async function haveRight(req, res, next) {
  logger.info(`haveRight req.user:${req.user}`);
  const droit = await Bar.findOne({
    where: { personneId: req.user.email },
    attributes: ["droits"]
  });

  if (droit.dataValues.droits === false) {
    return res.status(401).send("Non autorisé");
  }
  return next();
}

module.exports = haveRight;
