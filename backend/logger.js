require('dotenv').config();
const winston = require('winston');
const { format, transports } = winston;
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

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
    new DailyRotateFile({
      filename: path.join(process.env.LOG_DIR || 'logs', '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

module.exports = logger;
