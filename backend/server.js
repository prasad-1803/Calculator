require('dotenv').config();
const app = require('./app');
const { dbConfig } = require('./config');
const logger = require('./logger');

const port = require('./config/server.config').port;

dbConfig.authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully.');
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
    process.exit(1);
  });
