require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

// Set up Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

// Define the model
const CalculatorLog = sequelize.define('calculator_log', {
  expression: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  output: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
});

app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`, { body: req.body });
  res.on('finish', () => {
    logger.info(`Response: ${res.statusCode}`, { body: res.body });
  });
  next();
});

// POST endpoint to add a record
app.post('/api/logs', async (req, res) => {
  const { expression, is_valid, output } = req.body;
  if (!expression) {
    return res.status(400).json({ message: 'Expression is empty' });
  }
  if (is_valid === undefined) {
    return res.status(400).json({ message: 'Expression validity not provided' });
  }
  try {
    const log = await CalculatorLog.create({ expression, is_valid, output });
    if (is_valid) {
      res.status(200).json({ result: output });
    } else {
      res.status(400).json({ message: 'Expression is invalid' });
    }
  } catch (error) {
    logger.error('Error saving log', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET endpoint to fetch the latest 10 logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await CalculatorLog.findAll({ limit: 10, order: [['created_on', 'DESC']] });
    res.status(200).json(logs);
  } catch (error) {
    logger.error('Error fetching logs', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
