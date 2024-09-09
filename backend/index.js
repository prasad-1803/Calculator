require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./logger');
const cors = require('cors');  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Set up Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const User = sequelize.define('user', {
  first_name: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email_address: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 10,
      max: 115
    }
  },
  home_address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  primary_color: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  secondary_color: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'users'
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
    type: DataTypes.STRING,
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

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST endpoint for user sign-in
app.post('/api/signin', async (req, res) => {
  const { email_address, password } = req.body;

  if (!email_address || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email_address } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email_address }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error during sign-in', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST endpoint for user sign-up
app.post('/api/signup', async (req, res) => {
  const { first_name, last_name, email_address, password, age, home_address, primary_color, secondary_color, logo } = req.body;

  if (!first_name || !email_address || !password || !age || !home_address || !primary_color || !secondary_color || !logo) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email_address } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email address already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      first_name,
      last_name,
      email_address,
      password_hash,
      age,
      home_address,
      primary_color,
      secondary_color,
      logo
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    logger.error('Error creating user', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET endpoint for fetching user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  const email_address = req.query.email_address || req.user.email;

  if (!email_address) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  try {
    const user = await User.findOne({ where: { email_address } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error('Error fetching user profile', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT endpoint for updating user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { email_address, first_name, last_name, age, home_address, primary_color, secondary_color, logo } = req.body;

  if (!email_address) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  if (email_address !== req.user.email) {
    return res.status(403).json({ message: 'Email address cannot be changed' });
  }

  try {
    const user = await User.findOne({ where: { email_address } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.update({
      first_name,
      last_name,
      age,
      home_address,
      primary_color,
      secondary_color,
      logo
    }, {
      where: { email_address }
    });

    const updatedUser = await User.findOne({ where: { email_address } });
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    logger.error('Error updating user profile', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

// DELETE endpoint to delete records by IDs
app.delete('/api/logs', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid request: IDs must be an array and cannot be empty' });
  }

  try {
    await CalculatorLog.destroy({
      where: {
        id: ids
      }
    });
    res.status(200).json({ message: 'Logs deleted successfully' });
  } catch (error) {
    logger.error('Error deleting logs', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET endpoint to fetch the latest 10 logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await CalculatorLog.findAll({ order: [['created_on', 'DESC']] });
    res.status(200).json(logs);
  } catch (error) {
    logger.error('Error fetching logs', { error });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Test database connection
sequelize.authenticate()
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
