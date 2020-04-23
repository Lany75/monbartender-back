const logger = require("../helpers/logger");
var google = require("googleapis").google;
var OAuth2 = google.auth.OAuth2;

async function googleAuth(req, res, next) {
  logger.info(`google req.headers.authorization:${req.headers.authorization}`);

  if (!req.user && req.headers.authorization) {
    try {
      req.user = await getUser(req.headers.authorization);
    } catch (error) {
      logger.error(
        `An error has occured while signing in with token:${req.headers.authorization}, message: ${error.message}, stack:${error.stack}`
      );
      //return res.status(401).send("Non autorisé");
    }
  }
  return next();
}

async function getUser(authorizationHeader) {
  if (authorizationHeader.startsWith("Bearer ")) {
    var user = {};
    var accessToken = authorizationHeader.replace("Bearer ", "");
    var oauth2Client = new OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2"
    });
    const userInfo = await oauth2.userinfo.get();
    user.uid = userInfo.data.id;
    user.email = userInfo.data.email;
    user.name = userInfo.data.name;
    return user;
  }
  return;
}

module.exports = googleAuth;
