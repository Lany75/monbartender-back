const winston = require("winston");
const path = require("path");
const appRoot = require("app-root-path");
require("dotenv").config();
require("winston-daily-rotate-file");

const port = process.env.PORT || 8000;

const appSettings = {
  winston: {
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => {
        return `${info.timestamp}:[${info.level}]: ${info.message}`;
      }),
      winston.format.errors({ stack: true })
    ),
    defaultMeta: { service: "user-service" },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.DailyRotateFile({
        dirname: path.join(appRoot.path, "/logs"),
        filename: "error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level: "error"
      }),
      new winston.transports.DailyRotateFile({
        dirname: path.join(appRoot.path, "/logs"),
        filename: "combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d"
      })
    ],
    handleExceptions: true,
    exceptionHandlers: [
      new winston.transports.DailyRotateFile({
        dirname: path.join(appRoot.path, "/logs"),
        filename: "error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level: "error"
      })
    ]
  },
  swagger: {
    // import swaggerDefinitions
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MonBartender Swagger API",
        version: "1.0",
        description: "Official Swagger documentation for MonBartender API",
        contact: {
          name: "API Support",
          url: "https://github.com/Lany75/monbartender-back/issues",
          email: "mlanie.parry@gmail.com"
        },
        license: {
          name: "Apache 2.0",
          url: "https://www.apache.org/licenses/LICENSE-2.0.html"
        }
      },
      components: {
        securitySchemes: {
          googleAuth: {
            type: "oauth2",
            description: "Google authentication",
            flows: {
              implicit: {
                authorizationUrl: process.env.GOOGLE_AUTH_URI,
                scopes: {
                  email: "Email de l'utilisateur",
                  openid: "OpenID connect",
                  profile: "Profil de l'utilisateur"
                }
              }
            },
            "x-google-issuer": process.env.GOOGLE_ISSUER,
            "x-google-jwks_uri": process.env.GOOGLE_JWKS_URI,
            "x-google-audiences": process.env.GOOGLE_CLIENT_ID
          }
        }
      },
      servers: [
        {
          url: "http://localhost:8000/",
          description: "Local server"
        },
        {
          url: "https://{app}.herokuapp.com/",
          description: "The production API server",
          variables: {
            app: {
              enum: ["monbartender-back-staging", "monbartender-back-prod"],
              default: "monbartender-back-staging",
              description: "Nom de l'app dans Heroku"
            }
          }
        }
      ]
    },
    // path to the API docs
    apis: [
      path.join(appRoot.path, "src/routes/bars_router.js"),
      path.join(appRoot.path, "src/routes/cocktails_router.js"),
      path.join(appRoot.path, "src/routes/ingredients_router.js"),
      path.join(appRoot.path, "src/routes/verres_router.js"),
      path.join(appRoot.path, "src/models/bar.js"),
      path.join(appRoot.path, "src/models/cocktail.js"),
      path.join(appRoot.path, "src/models/cocktails-ingredients.js"),
      path.join(appRoot.path, "src/models/ingredient.js"),
      path.join(appRoot.path, "src/models/verre.js"),
      path.join(appRoot.path, "src/models/etapes-preparation.js")
    ]
  },
  hostname: "0.0.0.0",
  port: port
};

module.exports = appSettings;
