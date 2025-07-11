const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// جلب كل المرضى (صلاحيات: سكرتير، طبيب، أدمن)
router.get(
  '/',
  authenticateToken,
  authorizeRoles('secretary', 'doctor', 'admin'),
  patientController.getAllPatients
);

// جلب مريض حسب ID (صلاحيات: المريض نفسه أو دكتور أو سكرتير أو أدمن)
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('patient', 'doctor', 'secretary', 'admin'),
  patientController.getPatientById
);

// إنشاء مريض جديد (مفتوح بدون توكن - تسجيل)
router.post('/', patientController.createPatient);

// تعديل بيانات المريض (المريض فقط)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('patient'),
  patientController.updatePatient
);

// حذف مريض (سكرتير أو أدمن)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('secretary', 'admin'),
  patientController.deletePatient
);

// رفع مستند طبي (المريض فقط)
router.post(
  '/documents/:id',
  authenticateToken,
  authorizeRoles('patient'),
  upload.single('file'),
  patientController.uploadMedicalDocument
);
router.post('/reset-password', patientController.resetPassword);

module.exports = router;
