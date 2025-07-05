const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctorModel');
const db = require('../db'); // استخدام قاعدة البيانات مباشرة

// تسجيل طبيب جديد
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, phone, password, specialty } = req.body;

    if (!name || !email || !phone || !password || !specialty) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctorData = {
      name,
      email,
      phone,
      password: hashedPassword,
      specialty,
    };

    const result = await Doctor.createDoctor(doctorData);

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctorId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

// جلب بيانات مريض معيّن
exports.getPatientDetails = async (req, res) => {
  const patientId = req.params.id;

  try {
    const [rows] = await db.promise().query('SELECT * FROM patients WHERE id = ?', [patientId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ patient: rows[0] });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// مراجعة مستند طبي (قبول أو رفض)
exports.reviewMedicalDocument = async (req, res) => {
  const documentId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const [result] = await db.promise().query(
      'UPDATE medical_documents SET status = ? WHERE id = ?',
      [status, documentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ message: `Document ${status} successfully.` });
  } catch (error) {
    console.error('Error reviewing medical document:', error);
    res.status(500).json({ error: 'Failed to update document status' });
  }
};
