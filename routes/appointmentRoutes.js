const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// إنشاء موعد (طبيب أو سكرتير أو مريض - حسب الحالة)
router.post('/', authenticateToken, authorizeRoles('doctor', 'secretary', 'patient'), appointmentController.createAppointment);

// عرض كل المواعيد (سكرتير أو طبيب)
router.get('/', authenticateToken, authorizeRoles('secretary', 'doctor'), appointmentController.getAllAppointments);

// عرض مواعيد مريض محدد (مريض فقط يشوف مواعيده)
router.get('/patient/:patientId', authenticateToken, authorizeRoles('patient'), appointmentController.getAppointmentsByPatient);

// عرض مواعيد طبيب محدد (طبيب فقط)
router.get('/doctor/:doctorId', authenticateToken, authorizeRoles('doctor'), appointmentController.getAppointmentsByDoctor);

// تأكيد الموعد (طبيب فقط)
router.patch('/confirm/:id', authenticateToken, authorizeRoles('doctor'), appointmentController.confirmAppointment);

// إلغاء الموعد (طبيب أو سكرتير فقط)
router.patch('/cancel/:id', authenticateToken, authorizeRoles('doctor', 'secretary'), appointmentController.cancelAppointment);

// إلغاء الموعد من جهة المريض (مريض فقط)
router.delete('/cancel/:id', authenticateToken, authorizeRoles('patient'), appointmentController.cancelAppointmentByPatient);

module.exports = router;
