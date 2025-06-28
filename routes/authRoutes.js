const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// تسجيل الدخول للطبيب أو السكرتير
router.post('/login', authController.login);

module.exports = router;
