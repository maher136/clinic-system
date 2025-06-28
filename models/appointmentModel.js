const db = require('../db');

exports.createAppointment = (appointmentData, callback) => {
  const { patient_id, doctor_id, appointment_date } = appointmentData;

  const sql = `
    INSERT INTO appointments (patient_id, doctor_id, appointment_date)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [patient_id, doctor_id, appointment_date], (err, result) => {
    if (err) {
      console.error('Error creating appointment:', err);
      return callback(err);
    }
    callback(null, result);
  });
};
exports.getAllAppointments = (callback) => {
  const sql = `
    SELECT 
      appointments.id,
      patients.name AS patient_name,
      doctors.name AS doctor_name,
      appointment_date,
      status
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
    JOIN doctors ON appointments.doctor_id = doctors.id
    ORDER BY appointment_date ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err);
      return callback(err);
    }
    callback(null, results);
  });
};
exports.getAppointmentsByPatient = (patientId, callback) => {
  const sql = `
    SELECT 
      appointments.id,
      doctors.name AS doctor_name,
      appointment_date,
      status
    FROM appointments
    JOIN doctors ON appointments.doctor_id = doctors.id
    WHERE patient_id = ?
    ORDER BY appointment_date ASC
  `;
  db.query(sql, [patientId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
exports.getAppointmentsByDoctor = (doctorId, callback) => {
  const sql = `
    SELECT 
      appointments.id,
      patients.name AS patient_name,
      appointment_date,
      status
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
    WHERE doctor_id = ?
    ORDER BY appointment_date ASC
  `;
  db.query(sql, [doctorId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
exports.getAllAppointments = (callback) => {
  const sql = `
    SELECT 
      appointments.id,
      patients.name AS patient_name,
      doctors.name AS doctor_name,
      appointment_date,
      status
    FROM appointments
    JOIN patients ON appointments.patient_id = patients.id
    JOIN doctors ON appointments.doctor_id = doctors.id
    ORDER BY appointment_date ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
// تأكيد الموعد
exports.confirmAppointment = (appointmentId, callback) => {
  const sql = `UPDATE appointments SET status = 'confirmed' WHERE id = ?`;
  db.query(sql, [appointmentId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// إلغاء الموعد
exports.cancelAppointment = (appointmentId, callback) => {
  const sql = `UPDATE appointments SET status = 'cancelled' WHERE id = ?`;
  db.query(sql, [appointmentId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
exports.canCancelAppointment = (appointmentId, callback) => {
  const sql = `SELECT appointment_date FROM appointments WHERE id = ?`;
  db.query(sql, [appointmentId], (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) return callback(new Error('Appointment not found'));

    const appointmentDate = new Date(results[0].appointment_date);
    const now = new Date();
    const diffMs = appointmentDate - now; // الفرق بالميلي ثانية
    const diffHours = diffMs / (1000 * 60 * 60); // فرق بالساعات

    if (diffHours >= 6) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};
