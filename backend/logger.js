require('dotenv').config();
const winston = require('winston');
const { format, transports } = winston;
const path = require('path');

const logFilePath = path.join(process.env.LOG_DIR || 'logs', process.env.LOG_FILE || 'application.log');
const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath })
  ]
});

module.exports = logger;
