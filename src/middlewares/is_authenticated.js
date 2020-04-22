async function isAuthenticated(req, res, next) {
  if(!req.user
    || !req.user.email)
  {
    return res.status(401).send("Non autorisé");
  }
  return next();
}

module.exports = isAuthenticated;