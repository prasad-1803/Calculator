const profileService = require('../services/profileService');
const { handleError, handleSuccess } = require('../utils/helpers');

exports.getProfile = async (req, res) => {
  const email_address = req.query.email_address || req.user.email;
  try {
    const user = await profileService.getProfile(email_address);
    handleSuccess(res, user);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateProfile = async (req, res) => {
  const profileData = req.body;
  try {
    const updatedUser = await profileService.updateProfile(req.user.email, profileData);
    handleSuccess(res, { message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    handleError(res, error);
  }
};
