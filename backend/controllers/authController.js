const authService = require('../services/authService');
const { handleError, handleSuccess } = require('../utils/helpers');

exports.signIn = async (req, res) => {
  const { email_address, password } = req.body;
  try {
    const token = await authService.signIn(email_address, password);
    handleSuccess(res, { token });
  } catch (error) {
    handleError(res, error);
  }
};

exports.signUp = async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await authService.signUp(userData);
    handleSuccess(res, { message: 'User created successfully', user: newUser });
  } catch (error) {
    handleError(res, error);
  }
};
