const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/register', secretaryController.registerSecretary);
router.post('/add-patient', authenticateToken, authorizeRoles('secretary'), secretaryController.addPatient);
router.put('/edit-patient/:id', authenticateToken, authorizeRoles('secretary'), secretaryController.updatePatient);
router.delete('/delete-patient/:id', authenticateToken, authorizeRoles('secretary'), secretaryController.deletePatient);

module.exports = router;
