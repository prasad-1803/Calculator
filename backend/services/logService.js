const { CalculatorLog } = require('../models/calculatorLogModel');

exports.createLog = async (logData) => {
  return await CalculatorLog.create(logData);
};

exports.deleteLogs = async (ids) => {
  await CalculatorLog.destroy({ where: { id: ids } });
};

exports.getLogs = async () => {
  return await CalculatorLog.findAll({ order: [['created_on', 'DESC']] });
};
