const db = require('../db');
const moment = require('moment');

// إنشاء موعد جديد مع تحقق من دوام الطبيب والتعارض بالموعد
exports.createAppointment = async (req, res) => {
  const { patient_id, doctor_id, date_time, is_paid } = req.body;

  try {
    const appointmentMoment = moment(date_time);
    if (!appointmentMoment.isValid()) {
      return res.status(400).json({ message: 'Invalid date_time format' });
    }

    // استخرج يوم الأسبوع من الموعد
    const dayOfWeek = appointmentMoment.format('dddd'); // مثال: Monday, Tuesday...

    // 1. تحقق دوام الطبيب في هذا اليوم
    const [schedules] = await db.promise().query(
      'SELECT * FROM doctor_schedule WHERE doctor_id = ? AND day_of_week = ?',
      [doctor_id, dayOfWeek]
    );

    if (schedules.length === 0) {
      return res.status(400).json({ message: 'الطبيب غير متوفر في هذا اليوم' });
    }

    const schedule = schedules[0];

    // 2. تحقق أن الوقت ضمن دوام الطبيب
    const appointmentTimeStr = appointmentMoment.format('HH:mm:ss');
    if (appointmentTimeStr < schedule.start_time || appointmentTimeStr > schedule.end_time) {
      return res.status(400).json({ message: 'الوقت خارج دوام الطبيب' });
    }

    // 3. تحقق من عدم وجود موعد محجوز بنفس الوقت مع الطبيب
    const [existingAppointments] = await db.promise().query(
      'SELECT * FROM appointments WHERE doctor_id = ? AND DATE(date_time) = ? AND TIME(date_time) = ? AND status != "cancelled"',
      [doctor_id, appointmentMoment.format('YYYY-MM-DD'), appointmentTimeStr]
    );

    if (existingAppointments.length > 0) {
      return res.status(409).json({ message: 'هذا الوقت محجوز بالفعل مع الطبيب، الرجاء اختيار وقت آخر.' });
    }

    // 4. إدخال الموعد الجديد
    const [result] = await db.promise().query(
      'INSERT INTO appointments (patient_id, doctor_id, date_time, is_paid, status) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, date_time, is_paid || false, 'pending']
    );

    res.status(201).json({ message: 'تم حجز الموعد بنجاح', appointmentId: result.insertId });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// باقي الدوال تبقى كما هي:

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM appointments');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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

exports.cancelAppointmentByPatient = async (req, res) => {
  const appointmentId = req.params.id;

  try {
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
      await db.promise().query(
        `UPDATE appointments 
         SET status = 'cancelled', canceled_by_patient = true, refund_issued = true
         WHERE id = ?`,
        [appointmentId]
      );
      return res.status(200).json({ message: 'Appointment canceled and refund will be issued.' });
    } else {
      await db.promise().query('DELETE FROM appointments WHERE id = ?', [appointmentId]);
      return res.status(200).json({ message: 'Unpaid appointment canceled and removed.' });
    }
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAppointmentDetails = (req, res) => {
  const appointmentId = req.params.id;

  // Assuming you have a model method for this, else implement directly here
  appointmentModel.getAppointmentDetails(appointmentId, (err, data) => {
    if (err) {
      console.error('Error fetching appointment details:', err);
      return res.status(500).json({ error: 'Failed to fetch appointment details' });
    }

    res.status(200).json({ appointment: data });
  });
};
