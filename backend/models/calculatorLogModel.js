const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

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
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: true // Make sure this matches your requirements (nullable or not)
  }
}, {
  timestamps: false,
  tableName: 'calculator_logs'
});

module.exports = { CalculatorLog};
