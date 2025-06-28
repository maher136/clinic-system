// controllers/doctorController.js
const Doctor = require('../models/doctorModel');

exports.registerDoctor = async (req, res) => {
  try {
    const doctorData = req.body;
    const result = await Doctor.createDoctor(doctorData);
    res.status(201).json({ message: 'Doctor registered successfully', doctorId: result.insertId });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

exports.getPatientDetails = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Doctor.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ error: 'Failed to fetch patient details' });
  }
};

exports.reviewMedicalDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const { status } = req.body; // مثلا: 'approved' أو 'rejected'
    await Doctor.updateDocumentStatus(documentId, status);
    res.json({ message: 'Document review status updated successfully' });
  } catch (error) {
    console.error('Error reviewing medical document:', error);
    res.status(500).json({ error: 'Failed to update document status' });
  }
};
