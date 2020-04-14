var admin = require("../firebase-admin/admin");

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken) {
      req.body = {};
      req.body.uid = decodedToken.uid;
      req.body.email = decodedToken.email;
      req.body.name = decodedToken.name;

      return next();
    } else {
      return res.status(401).send("Non autorisé");
    }
  } catch (e) {
    console.log("error : ", e);
    return res.status(401).send("Non autorisé");
  }
}

module.exports = verifyToken;
