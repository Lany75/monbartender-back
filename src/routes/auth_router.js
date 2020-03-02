const express = require("express");

const authRouter = express.Router();

const passport = require("passport");
const util = require("util");
const url = require("url");
const querystring = require("querystring");

require("dotenv").config();

authRouter.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  (request, response) => {
    response.redirect("/");
  }
);

authRouter.get("/callback", (request, response, next) => {
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return response.redirect("/login");
    }
    require.logIn(user, err => {
      if (err) {
        return next(err);
      }
      const returnTo = request.session.returnTo;
      delete request.session.returnTo;
      response.redirect(returnTo || "/");
    });
  })(request, response, next);
});

authRouter.get("/logout", (request, response) => {
  request.logOut();

  let returnTo = request.protocol + "://" + request.hostname;
  const port = request.connection.localPort;

  if (port !== undefined && (port !== 80) & (port !== 443)) {
    returnTo =
      process.env.NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(
    util.format("https://%s/logout", process.env.AUTH0_DOMAIN)
  );
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  response.redirect(logoutURL);
});

module.exports = authRouter;
