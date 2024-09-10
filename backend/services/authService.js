const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signIn = async (email_address, password) => {
  const user = await User.findOne({ where: { email_address } });
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new Error('Invalid email or password');
  }
  return jwt.sign({ id: user.id, email: user.email_address }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.signUp = async (userData) => {
  const existingUser = await User.findOne({ where: { email_address: userData.email_address } });
  if (existingUser) throw new Error('User with this email address already exists');

  const salt = await bcrypt.genSalt(10);
  userData.password_hash = await bcrypt.hash(userData.password, salt);
  return await User.create(userData);
};
