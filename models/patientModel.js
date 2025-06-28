const db = require('../db');
const bcrypt = require('bcryptjs');

const createPatient = async (patient, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(patient.password, 10);
    const sql = 'INSERT INTO patients (name, email, phone, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [patient.name, patient.email, patient.phone, hashedPassword], callback);
  } catch (error) {
    callback(error);
  }
};

const getAllPatients = (callback) => {
  const sql = 'SELECT * FROM patients';
  db.query(sql, callback);
};

const getPatientById = (id, callback) => {
  const sql = 'SELECT * FROM patients WHERE id = ?';
  db.query(sql, [id], callback);
};

const updatePatient = async (id, patient, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(patient.password, 10);
    const sql = 'UPDATE patients SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?';
    db.query(sql, [patient.name, patient.email, patient.phone, hashedPassword, id], callback);
  } catch (error) {
    callback(error);
  }
};

const deletePatient = (id, callback) => {
  const sql = 'DELETE FROM patients WHERE id = ?';
  db.query(sql, [id], callback);
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
