const path = require('path');
const medicalDocumentModel = require('../models/medicalDocumentModel');

exports.uploadDocument = (req, res) => {
  const { patient_id } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const document = {
    patient_id,
    file_path: file.filename,
  };

  medicalDocumentModel.uploadDocument(document, (err, result) => {
    if (err) {
      console.error('Error uploading document:', err);
      return res.status(500).json({ error: 'Failed to upload document' });
    }

    res.status(201).json({ message: 'Document uploaded successfully' });
  });
};

exports.getAllDocuments = (req, res) => {
  medicalDocumentModel.getAllDocuments((err, documents) => {
    if (err) {
      console.error('Error fetching documents:', err);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }

    res.status(200).json(documents);
  });
};

exports.reviewDocument = (req, res) => {
  const documentId = req.params.id;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  medicalDocumentModel.updateDocumentStatus(documentId, status, (err) => {
    if (err) {
      console.error('Error updating document status:', err);
      return res.status(500).json({ error: 'Failed to update status' });
    }

    res.status(200).json({ message: 'Document status updated successfully' });
  });
};
exports.getDocumentsByPatient = (req, res) => {
  const patientId = req.user.id;

  medicalDocumentModel.getDocumentsByPatient(patientId, (err, results) => {
    if (err) {
      console.error('Error fetching documents:', err);
      return res.status(500).json({ error: 'Failed to fetch documents' });
    }

    res.status(200).json(results);
  });
};

