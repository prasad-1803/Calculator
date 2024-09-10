const { User } = require('../models/userModel');

exports.getProfile = async (email_address) => {
  return await User.findOne({ where: { email_address } });
};

exports.updateProfile = async (email_address, profileData) => {
  await User.update(profileData, { where: { email_address } });
  return await User.findOne({ where: { email_address } });
};
