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
    SELECT id, file_path, status, created_at 
    FROM medical_documents 
    WHERE patient_id = ?
    ORDER BY created_at DESC
  `;
  db.query(sql, [patientId], callback);
};

const getAllDocuments = (callback) => {
  const sql = `
    SELECT id, patient_id, file_path, status, created_at 
    FROM medical_documents
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

const updateDocumentStatus = (documentId, status, callback) => {
  const sql = `
    UPDATE medical_documents 
    SET status = ? 
    WHERE id = ?
  `;
  db.query(sql, [status, documentId], callback);
};
//تصدير نهائي
module.exports = {
  uploadDocument,
  getDocumentsByPatient,
  getAllDocuments,
  updateDocumentStatus,
};
