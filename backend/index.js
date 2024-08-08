require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger'); // Assuming you have a logger setup
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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
app.post('/api/post/', async (req, res) => {
  const { expression, is_valid, output } = req.body;
  if (!expression) {
    return res.status(400).json({ message: 'Expression is empty' });
  }
  if (is_valid === undefined) {
    return res.status(400).json({ message: 'Expression validity not provided' });
  }
  try {
    // Save the log to the database
    const log = await CalculatorLog.create({ expression, is_valid, output });

    // Fetch the updated logs from the database
    const latestLogs = await CalculatorLog.findAll({
      limit: 10,
      order: [['created_on', 'DESC']]
    });

    // Broadcast the updated logs to all WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'LATEST_LOGS',
          data: latestLogs
        }));
      }
    });

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
app.get('/api/getlogs', async (req, res) => {
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
  const POLL_INTERVAL = 5000; // 5 seconds, adjust as needed

  const checkForNewLogs = async () => {
    try {
      // Query for new logs since the lastId
      const newLogs = await CalculatorLog.findAll({
        where: { id: { [Sequelize.Op.gt]: lastIdNum } },
        limit: 10,
        order: [['created_on', 'DESC']]
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
const clients = new Set();

wss.on('connection', async (ws) => {
  clients.add(ws);
  logger.info('WebSocket connection established');

  // Fetch the latest logs from the database and send them to the newly connected client
  try {
    const latestLogs = await CalculatorLog.findAll({
      limit: 10,
      order: [['created_on', 'DESC']]
    });

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'LATEST_LOGS',
        data: latestLogs
      }));
    }
  } catch (error) {
    logger.error('Error fetching latest logs', { error });
  }

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
  
      if (data.type === 'log') {
        const { expression, is_valid, output } = data;
  
        // Ensure data properties are defined
        if (!expression || is_valid === undefined) {
          throw new Error('Invalid data format');
        }
  
        // Save the log to the database
        const log = await CalculatorLog.create({ expression, is_valid, output });
  
        // Fetch the updated logs from the database
        const latestLogs = await CalculatorLog.findAll({
          limit: 10,
          order: [['created_on', 'DESC']]
        });
  
        // Broadcast the updated logs to all connected clients
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'LATEST_LOGS',
              data: latestLogs
            }));
          }
        });
      } else if (data.type === 'UPDATE') {
        // Broadcast real-time input changes to all connected clients
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'UPDATE',
              data: data.data
            }));
          }
        });
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    logger.info('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port ${process.env.PORT || 3000}`);
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
