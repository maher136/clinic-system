const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// تسجيل الدخول
router.post('/login', authController.login);

// إعادة تعيين كلمة المرور لأي مستخدم
router.patch('/reset-password', authController.resetPassword);

module.exports = router;
