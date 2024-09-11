const { CalculatorLog } = require('../models/calculatorLogModel');

exports.createLog = async (logData) => {
  return await CalculatorLog.create(logData);
};

exports.deleteLogs = async (ids) => {
  await CalculatorLog.destroy({ where: { id: ids } });
};



exports.getLogsForUser = async (userId) => {
    try {
      return await CalculatorLog.findAll({
        where: { user_id: userId }, // Filter by user ID
        order: [['created_on', 'DESC']]
      });
    } catch (error) {
      throw new Error('Error fetching user logs');
    }
  };