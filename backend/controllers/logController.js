const logService = require('../services/logService');
const { handleError, handleSuccess } = require('../utils/helpers');

exports.createLog = async (req, res) => {
  const logData = req.body;
  try {
    const log = await logService.createLog(logData);
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
    const logs = await logService.getLogs();
    handleSuccess(res, logs);
  } catch (error) {
    handleError(res, error);
  }
};
