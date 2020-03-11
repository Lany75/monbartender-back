var admin = require("../firebase-admin/admin");

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;
  //console.log("idToken : ", idToken);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken) {
      //console.log("decodedToken : ", decodedToken);
      //console.log("decodedToken.uid : ", decodedToken.uid);

      req.body = {};

      req.body.uid = decodedToken.uid;
      req.body.email = decodedToken.email;
      req.body.name = decodedToken.name;
      //console.log("req.body.uid", req.body.uid);
      //console.log("req.body.email", req.body.email);
      //console.log("req.body.name", req.body.name);

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
