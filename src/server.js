let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let routes = require("./routes");
let swaggerJsdoc = require("swagger-jsdoc");
let swaggerUi = require("swagger-ui-express");
let logger = require("./helpers/logger");
let appSettings = require("../config/app-settings");

// INIT WINSTON LOGGER
logger.info("Express server setup");
let app = express();

// REGISTER SWAGGER UI
logger.info("Swagger setup");
var swaggerSpec = swaggerJsdoc(appSettings.swagger);
app.use("/api-docs", swaggerUi.serve);
app.get(
  "/api-docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      oauth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        appName: "MonBartender"
      }
    }
  })
);
app.get("/swagger.json", function(req, res) {
  logger.info("Requesting swagger.json");
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.get("/oauth2-redirect.html", function(req, res) {
  logger.info("Redirecting oauth2 response");
  const targetUrl = req.baseUrl + "/api-docs" + "/oauth2-redirect.html";
  logger.info(`targetURL:${targetUrl} et req:${req}`);
  res.redirect(targetUrl);
});

// REGISTER BODY PARSER
logger.info("Registering Body Parser");
app.use(bodyParser.urlencoded({ extended: false }));

// REGISTER ASSETS
logger.info("Registering static Assets");
app.use("/api/images", express.static("src/assets"));

// REGISTER CORS
logger.info("CORS Setup");
app.use("/", cors());

if (process.env.NODE_ENV !== "test") {
  // REGISTER GOOGLE AUTH
  app.use("/", require("./middlewares/google_auth"));
  // REGISTER FIREBASE AUTH
  app.use("/", require("./middlewares/firebase_auth"));
} else {
  // REGISTER UNIT TESTING AUTH
  app.use("/", require("./middlewares/test_auth"));
}

// REGISTER ROUTES
logger.info("Registering routes");
app.use("/", routes);

app.use(logErrorHandler);
app.use(clientErrorHandler);
app.use(errorHandler);

// START SERVER
logger.info(`Starting server on: ${appSettings.hostname}:${appSettings.port}`);
let server = app.listen(appSettings.port, appSettings.hostname, () => {
  logger.info(
    `Server fully started on: ${appSettings.hostname}:${appSettings.port}`
  );
});

function logErrorHandler(err, req, res, next) {
  // add this line to include winston logging
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  logger.error(`${err.stack}`);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error", { error: err });
}

module.exports = server; // for testing
