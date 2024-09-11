const express = require('express');
const logController = require('../controllers/logController');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware'); 

router.post('/logs',authenticate, logController.createLog);
router.delete('/logs',authenticate,logController.deleteLogs);
router.get('/logs', authenticate,logController.getLogs);

module.exports = router;
