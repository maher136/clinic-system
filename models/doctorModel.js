const db = require('../db');

exports.createDoctor = ({ name, email, phone, password, specialty }) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO doctors (name, email, phone, password, specialty) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, password, specialty], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getPatientById = (patientId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM patients WHERE id = ?';
    db.query(sql, [patientId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // نرجع أول نتيجة لأنها مفردة
    });
  });
};

exports.updateDocumentStatus = (documentId, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE medical_documents SET status = ? WHERE id = ?';
    db.query(sql, [status, documentId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
