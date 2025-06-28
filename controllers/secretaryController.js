const Secretary = require('../models/secretaryModel');

// تسجيل سكرتير جديد
exports.registerSecretary = (req, res) => {
  Secretary.createSecretary(req.body, (err, result) => {
    if (err) {
      console.error('Error creating secretary:', err);
      return res.status(500).json({ error: 'Failed to create secretary' });
    }
    res.status(201).json({ message: 'Secretary registered successfully', secretaryId: result.insertId });
  });
};

// إضافة مريض جديد بواسطة السكرتير
exports.addPatient = (req, res) => {
  Secretary.addPatient(req.body, (err, result) => {
    if (err) {
      console.error('Error adding patient:', err);
      return res.status(500).json({ error: 'Failed to add patient' });
    }
    res.status(201).json({ message: 'Patient added successfully', patientId: result.insertId });
  });
};

// تعديل بيانات مريض بواسطة السكرتير
exports.updatePatient = (req, res) => {
  const id = req.params.id;
  Secretary.updatePatient(id, req.body, (err, result) => {
    if (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ error: 'Failed to update patient' });
    }
    res.status(200).json({ message: 'Patient updated successfully' });
  });
};

// حذف مريض بواسطة السكرتير
exports.deletePatient = (req, res) => {
  const id = req.params.id;
  Secretary.deletePatient(id, (err, result) => {
    if (err) {
      console.error('Error deleting patient:', err);
      return res.status(500).json({ error: 'Failed to delete patient' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
};
