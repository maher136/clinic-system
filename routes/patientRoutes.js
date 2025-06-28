const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// كل المرضى (يحتاج توكن وصلاحية سكرتير أو طبيب أو مسؤول)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('secretary', 'doctor', 'admin'),
  patientController.getAllPatients
);

// بيانات مريض محدد (المريض نفسه أو الطبيب أو السكرتير أو المسؤول)
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('patient', 'doctor', 'secretary', 'admin'),
  patientController.getPatientById
);

// إنشاء مريض جديد (بدون توكن، لأنه تسجيل جديد)
router.post('/', patientController.createPatient);

// تعديل بيانات المريض (المريض نفسه فقط)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('patient'),
  patientController.updatePatient
);

// حذف مريض (عادة صلاحية سكرتير أو مسؤول)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('secretary', 'admin'),
  patientController.deletePatient
);

// رفع المستندات الطبية (المريض فقط مع رفع ملف واحد)
router.post(
  '/documents/:id',
  authenticateToken,
  authorizeRoles('patient'),
  upload.single('file'), // هنا رفع الملف الحي
  patientController.uploadMedicalDocument
);

module.exports = router;
