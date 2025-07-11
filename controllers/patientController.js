const patientModel = require('../models/patientModel');

// إنشاء مريض جديد
exports.createPatient = (req, res) => {
  const patient = req.body;

  if (!patient.name || !patient.email || !patient.phone || !patient.password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  patientModel.createPatient(patient, (err, result) => {
    if (err) {
      console.error('Error creating patient:', err);
      return res.status(500).json({ error: 'Failed to create patient' });
    }
    res.status(201).json({ message: 'Patient created successfully', id: result.insertId });
  });
};

// جلب جميع المرضى
exports.getAllPatients = (req, res) => {
  patientModel.getAllPatients((err, patients) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }
    res.status(200).json(patients);
  });
};

// جلب مريض بواسطة ID
exports.getPatientById = (req, res) => {
  const patientId = req.params.id;

  patientModel.getPatientById(patientId, (err, patient) => {
    if (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Failed to fetch patient' });
    }
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json(patient);
  });
};

// تعديل بيانات مريض
exports.updatePatient = (req, res) => {
  const patientId = req.params.id;
  const updatedData = req.body;

  patientModel.updatePatient(patientId, updatedData, (err, result) => {
    if (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ error: 'Failed to update patient' });
    }
    res.status(200).json({ message: 'Patient updated successfully' });
  });
};

// حذف مريض
exports.deletePatient = (req, res) => {
  const patientId = req.params.id;

  patientModel.deletePatient(patientId, (err, result) => {
    if (err) {
      console.error('Error deleting patient:', err);
      return res.status(500).json({ error: 'Failed to delete patient' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
};

// رفع مستند طبي
exports.uploadMedicalDocument = (req, res) => {
  const patientId = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const documentData = {
    patient_id: patientId,
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path
  };

  patientModel.uploadMedicalDocument(documentData, (err, result) => {
    if (err) {
      console.error('Error uploading document:', err);
      return res.status(500).json({ error: 'Failed to upload document' });
    }
    res.status(201).json({ message: 'Document uploaded successfully', id: result.insertId });
  });
};
const bcrypt = require('bcryptjs');

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = 'UPDATE patients SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json({ message: 'Failed to reset password' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Patient not found with this email' });
      }

      res.status(200).json({ message: 'Password reset successfully' });
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

