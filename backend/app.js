const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./logger');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const logRoutes = require('./routes/logRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`, { body: req.body });
  res.on('finish', () => {
    logger.info(`Response: ${res.statusCode}`, { body: res.body });
  });
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', logRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
