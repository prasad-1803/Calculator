const logService = require('../services/logService');
const { handleError, handleSuccess } = require('../utils/helpers');

exports.createLog = async (req, res) => {
  const logData = req.body;
  
  // Assuming you are sending `user_id` in the request body or extracting it from the token/session
  const userId = req.body.userId; // Adjust this based on where you're getting the user ID

  try {
    // Ensure `user_id` is included in the log data
    const log = await logService.createLog({ ...logData, user_id: userId });
    handleSuccess(res, { result: log.output });
  } catch (error) {
    handleError(res, error);
  }
};


exports.deleteLogs = async (req, res) => {
  const { ids } = req.body;
  try {
    await logService.deleteLogs(ids);
    handleSuccess(res, { message: 'Logs deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getLogs = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const logs = await logService.getLogsForUser(userId); // Fetch logs for the specific user
    handleSuccess(res, logs);
  } catch (error) {
    handleError(res, error);
  }
};