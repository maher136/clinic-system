const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// إنشاء حساب آدمن 
router.post('/register', adminController.registerAdmin);

// جلب كل الآدمنز
router.get('/', authenticateToken, authorizeRoles('admin'), adminController.getAllAdmins);

module.exports = router;
