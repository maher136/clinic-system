const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;

// ✅ 4. routes/appointmentRoutes.js (جزء من الراوتر)
const upload = require('../middlewares/uploadMiddleware');

// رفع مستند طبي
router.post(
  '/documents/:appointment_id',
  authenticateToken,
  authorizeRoles('patient'),
  upload.single('medicalDocument'),
  medicalDocumentController.uploadMedicalDocument
);

// مراجعة مستند طبي
router.patch(
  '/documents/:id',
  authenticateToken,
  authorizeRoles('doctor'),
  medicalDocumentController.reviewMedicalDocument
);
