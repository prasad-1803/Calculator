const express = require('express');
const profileController = require('../controllers/profileController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authenticateToken, profileController.getProfile);
router.put('/profile', authenticateToken, profileController.updateProfile);

module.exports = router;
