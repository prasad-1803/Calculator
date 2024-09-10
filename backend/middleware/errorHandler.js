const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', { error: err.message });
  res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorHandler;
