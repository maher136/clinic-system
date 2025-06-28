const patientModel = require('../models/patientModel');

// جلب كل المرضى
exports.getAllPatients = (req, res) => {
  patientModel.getAllPatients((err, results) => {
    if (err) {
      console.error('Error fetching patients:', err);
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }
    res.status(200).json(results);
  });
};
// جلب مريض واحد حسب الـ id
exports.getPatientById = (req, res) => {
  const id = req.params.id;
  patientModel.getPatientById(id, (err, result) => {
    if (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Failed to fetch patient' });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(200).json(result[0]);
  });
};

// إنشاء مريض جديد
exports.createPatient = (req, res) => {
  const patient = req.body;
  patientModel.createPatient(patient, (err, result) => {
    if (err) {
      console.error('Error creating patient:', err);
      return res.status(500).json({ error: 'Failed to create patient' });
    }
    res.status(201).json({ message: 'Patient created successfully', id: result.insertId });
  });
};

// تعديل بيانات مريض
exports.updatePatient = (req, res) => {
  const id = req.params.id;
  const updatedPatient = req.body;
  patientModel.updatePatient(id, updatedPatient, (err) => {
    if (err) {
      console.error('Error updating patient:', err);
      return res.status(500).json({ error: 'Failed to update patient' });
    }
    res.status(200).json({ message: 'Patient updated successfully' });
  });
};

// حذف مريض
exports.deletePatient = (req, res) => {
  const id = req.params.id;
  patientModel.deletePatient(id, (err) => {
    if (err) {
      console.error('Error deleting patient:', err);
      return res.status(500).json({ error: 'Failed to delete patient' });
    }
    res.status(200).json({ message: 'Patient deleted successfully' });
  });
};

// رفع المستندات الطبية - (المريض فقط)
exports.uploadMedicalDocument = (req, res) => {
  const id = req.params.id;
  // controllers/patientController.js
exports.uploadMedicalDocument = (req, res) => {
  const patientId = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const sql = `
    INSERT INTO medical_documents (patient_id, file_name, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(sql, [patientId, file.filename], (err, result) => {
    if (err) {
      console.error('Error uploading document:', err);
      return res.status(500).json({ error: 'Failed to upload document' });
    }

    res.status(201).json({ message: 'Document uploaded successfully' });
  });
};

  // هنا من المفترض تضيف الكود لتحميل الملف وحفظه وربطه بالمريض
  // مثال (تحقق من وجود الملف، احفظه، حدث السجل في DB)
  // ولأن الكود غير موجود عندك حالياً، هذا قالب مبدئي:
  res.status(200).json({ message: `Medical document uploaded for patient id ${id}` });
};
