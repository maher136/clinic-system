const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/register', secretaryController.registerSecretary);

// السكرتير يضيف مريض جديد
router.post('/add-patient', authenticateToken, authorizeRoles('secretary'), secretaryController.addPatient);

// السكرتير يعدل بيانات مريض
router.put('/edit-patient/:id', authenticateToken, authorizeRoles('secretary'), secretaryController.updatePatient);

// السكرتير يحذف مريض
router.delete('/delete-patient/:id', authenticateToken, authorizeRoles('secretary'), secretaryController.deletePatient);

module.exports = router;