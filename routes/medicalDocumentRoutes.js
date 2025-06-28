const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const medicalDocumentController = require('../controllers/medicalDocumentController');

// إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// المريض يرفع مستند
router.post(
  '/upload',
  authenticateToken,
  authorizeRoles('patient'),
  upload.single('document'),
  medicalDocumentController.uploadDocument
);

// الطبيب يراجع المستند (قبول/رفض)
router.patch(
  '/review/:id',
  authenticateToken,
  authorizeRoles('doctor'),
  medicalDocumentController.reviewDocument
);

module.exports = router;