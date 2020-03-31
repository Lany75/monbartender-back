const logger = require('../helpers/logger');

async function testAuth(req, res, next) {
  if(!req.user
    && req.headers.authorization)
  {
    req.user = {
      uid: req.headers.authorization,
      email: req.headers.authorization,
      name: req.headers.authorization
    };
  }
  return next();
}

module.exports = testAuth;