const db = require('../db');

const uploadDocument = (document, callback) => {
  const sql = `
    INSERT INTO medical_documents (patient_id, file_path, status)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [document.patient_id, document.file_path, 'pending'], callback);
};

const getDocumentsByPatient = (patientId, callback) => {
  const sql = `
    SELECT * FROM medical_documents WHERE patient_id = ?
  `;
  db.query(sql, [patientId], callback);
};

const updateDocumentStatus = (documentId, status, callback) => {
  const sql = `
    UPDATE medical_documents SET status = ? WHERE id = ?
  `;
  db.query(sql, [status, documentId], callback);
};

exports.getAllDocuments = (callback) => {
  const sql = 'SELECT * FROM medical_documents';
  db.query(sql, callback);
};
module.exports = {
  uploadDocument,
  getDocumentsByPatient,
  updateDocumentStatus,
};
exports.getDocumentsByPatient = (patientId, callback) => {
  const sql = 'SELECT * FROM medical_documents WHERE patient_id = ?';
  db.query(sql, [patientId], callback);
};
