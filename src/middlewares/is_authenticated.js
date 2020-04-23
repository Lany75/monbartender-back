const logger = require("../helpers/logger");

async function isAuthenticated(req, res, next) {
  logger.info(`isAuthenticated req.user:${req.user}`);

  if (!req.user || !req.user.email) {
    return res.status(401).send("Non autorisé");
  }
  return next();
}

module.exports = isAuthenticated;
