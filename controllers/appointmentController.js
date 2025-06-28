const db = require('../db');
const moment = require('moment');

// إنشاء موعد جديد
exports.createAppointment = async (req, res) => {
  const { patient_id, doctor_id, date_time, is_paid } = req.body;

  try {
    const [result] = await db.promise().query(
      'INSERT INTO appointments (patient_id, doctor_id, date_time, is_paid, status) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, date_time, is_paid || false, 'pending']
    );

    res.status(201).json({ message: 'Appointment created successfully', appointmentId: result.insertId });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// جلب كل المواعيد
exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM appointments');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// جلب مواعيد مريض معين
exports.getAppointmentsByPatient = async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM appointments WHERE patient_id = ?',
      [patientId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// جلب مواعيد طبيب معين
exports.getAppointmentsByDoctor = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM appointments WHERE doctor_id = ?',
      [doctorId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// تأكيد موعد (طبيب أو سكرتيرة)
exports.confirmAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const [result] = await db.promise().query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['confirmed', appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment confirmed successfully.' });
  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// إلغاء موعد (طبيب أو سكرتيرة)
exports.cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const [result] = await db.promise().query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['cancelled', appointmentId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// إلغاء الموعد من قبل المريض مع شروط الوقت والدفع
exports.cancelAppointmentByPatient = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    // جلب بيانات الموعد
    const [appointmentRows] = await db.promise().query(
      'SELECT * FROM appointments WHERE id = ?',
      [appointmentId]
    );

    if (appointmentRows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const appointment = appointmentRows[0];

    const now = moment();
    const appointmentTime = moment(appointment.date_time);

    const hoursDiff = appointmentTime.diff(now, 'hours');

    if (hoursDiff < 6) {
      return res.status(400).json({
        message: 'Cannot cancel appointment less than 6 hours before the scheduled time.',
      });
    }

    if (appointment.is_paid) {
      // إلغاء وتحديث حالة الاسترجاع
      await db.promise().query(
        `UPDATE appointments 
         SET status = 'cancelled', canceled_by_patient = true, refund_issued = true
         WHERE id = ?`,
        [appointmentId]
      );
      return res.status(200).json({ message: 'Appointment canceled and refund will be issued.' });
    } else {
      // حذف الموعد نهائياً
      await db.promise().query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
      return res.status(200).json({ message: 'Unpaid appointment canceled and removed.' });
    }
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
