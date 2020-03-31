const winston = require('winston');
const appSettings = require('../../config/app-settings');

const logger = winston.createLogger(appSettings.winston);
if (process.env.NODE_ENV !== 'production'
  && process.env.NODE_ENV !== 'test') {
    logger.add(new winston.transports.Console(
        { 
            format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple())
        }));
}
process.on('exit', function () {
  logger.info('Your process is exiting');
  logger.info('CHILL WINSTON!', { seriously: true });
  logger.end();
});

module.exports = logger;