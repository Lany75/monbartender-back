var admin = require("../firebase-admin/admin");
const logger = require('../helpers/logger');

async function verifyToken(req, res, next) {
  if(!req.user
    && req.headers.authorization)
  {
    try{
      req.user = await getUser(req.headers.authorization);
    }
    catch (error)
    {
      logger.error(`An error has occured while signing in with token:${req.headers.authorization}, message: ${error.message}, stack:${error.stack}`);
      return res.status(401).send("Non autorisé");
    };
  }
  return next();
}

async function getUser(idToken)
{
  var user = {};
  logger.info(`Verifying token with firebase:${idToken}`);
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  logger.info(`Decoded token:${decodedToken} is authorized`);

  user.uid = decodedToken.uid;
  user.email = decodedToken.email;
  user.name = decodedToken.name;

  return user;
}

module.exports = verifyToken;
