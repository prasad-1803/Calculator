const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

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

module.exports = {User};
