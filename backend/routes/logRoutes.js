const express = require('express');
const logController = require('../controllers/logController');
const router = express.Router();

router.post('/logs', logController.createLog);
router.delete('/logs', logController.deleteLogs);
router.get('/logs', logController.getLogs);

module.exports = router;
