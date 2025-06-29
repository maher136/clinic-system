const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/register', doctorController.registerDoctor);

// الطبيب يشوف ملف مريض معين
router.get('/patient/:id', authenticateToken, authorizeRoles('doctor'), doctorController.getPatientDetails);

// الطبيب يقبل/يرفض مستندات مريض
router.patch('/documents/:id', authenticateToken, authorizeRoles('doctor'), doctorController.reviewMedicalDocument);


module.exports = router;
