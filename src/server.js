const express = require("express");
const cors = require("cors");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();

const routes = require("./routes");

const server = express();
const port = process.env.PORT || "8080";

// Configuration de la session
const session = {
  secret: "	MammaliaCarnivoraChordataFelidaePantheraleo",
  cookie: {},
  resave: false,
  saveUninitialized: false
};
if (server.get("env") === "production") {
  session.cookie.secure = true;
}

// Configuration de passport
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);

// Configuration du server
server.set("views", path.join(__dirname, "views"));
server.set("views engine", "pug");
server.use(express.static(path.join(__dirname, "public")));

server.use(expressSession(session));

passport.use(strategy);
server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//app.use("src/assets");
server.use("/api/images", express.static("src/assets"));

server.use("/api", cors());

server.use("/api", routes);

server.listen(8080, () => {
  console.log("Server lancé sur le port 8080");
});
