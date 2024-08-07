require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');
const cors = require('cors');
const WebSocket = require('ws');

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
}, {
  timestamps: false,
  tableName: 'calculator_logs'
});

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
      // Notify WebSocket clients of new data
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'NEW_LOG', data: log }));
        }
      });
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

// Long Polling endpoint
app.get('/api/logs/long-polling', async (req, res) => {
  const { lastId } = req.query;
  const lastIdNum = parseInt(lastId, 10) || 0;

  // Set a timeout for polling interval
  const POLL_INTERVAL = 5000; // 1 second, adjust as needed

  const checkForNewLogs = async () => {
    try {
      // Query for new logs since the lastId
      const newLogs = await CalculatorLog.findAll({
        where: { id: { [Sequelize.Op.gt]: lastIdNum } },
        limit:10,
        order: [['created_on', 'DESC']],
    
      
      });

      if (newLogs.length > 0) {
        res.json(newLogs); // Respond with new logs
      } else {
        // No new logs, set a timeout and check again
        setTimeout(checkForNewLogs, POLL_INTERVAL);
      }
    } catch (error) {
      logger.error('Error in long polling', { error });
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Start checking for new logs
  checkForNewLogs();

  // Optional: Set a timeout for the client to cancel the request
  req.on('close', () => {
    logger.info('Client disconnected from long polling');
  });
});


// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });

app.server = app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});

app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
    logger.info('WebSocket connection established');
  });
});

wss.on('connection', (ws) => {
  logger.info('WebSocket connection established');
  ws.on('message', (message) => {
    logger.info('Received WebSocket message', { message });
  });
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
    process.exit(1);
  });
