const logger = require("../helpers/logger");
const { UNAUTHORIZED } = require("../helpers/status_code");

async function isAuthenticated(req, res, next) {
  logger.info(`isAuthenticated req.user:${req.user}`);

  if (!req.user || !req.user.email) {
    return res.status(UNAUTHORIZED).send("Non autorisé");
  }
  return next();
}

module.exports = isAuthenticated;
