const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
// كل المرضى (يحتاج توكن وصلاحية سكرتير أو طبيب أو غيرهم حسب النظام)
router.get('/', authenticateToken, authorizeRoles('secretary', 'doctor', 'admin'), patientController.getAllPatients);

// بيانات مريض محدد (المريض نفسه أو الطبيب أو السكرتير)
router.get('/:id', authenticateToken, authorizeRoles('patient', 'doctor', 'secretary', 'admin'), patientController.getPatientById);

// إنشاء مريض جديد (عادة هذه صلاحية سكرتير أو مسؤول)
router.post('/', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.createPatient);

// تعديل بيانات المريض (المريض نفسه فقط)
router.put('/:id', authenticateToken, authorizeRoles('patient'), patientController.updatePatient);

// حذف مريض (عادة صلاحية سكرتير أو مسؤول)
router.delete('/:id', authenticateToken, authorizeRoles('secretary', 'admin'), patientController.deletePatient);

// رفع المستندات الطبية (المريض فقط)
router.post('/documents/:id', authenticateToken, authorizeRoles('patient'), patientController.uploadMedicalDocument);

// routes/patientRoutes.js

// المريض يرفع مستنداته الطبية
router.post(
  '/documents/:id',
  authenticateToken,
  authorizeRoles('patient'),
  upload.single('file'), // ← هذه السطر المهم
  patientController.uploadMedicalDocument
);

module.exports = router;
