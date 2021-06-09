require("dotenv").config();
const logger = require("../../helpers/logger");

module.exports = {
  dialect: "postgres",
  url: process.env.DATABASE_URL,
  // pool configuration used to pool database connections
  pool: {
    min: 0,
    max: 5,
    idle: 15000,
    acquire: 30000
  },
  logging: (...msg) => {
    logger.debug(msg);
  }
};
