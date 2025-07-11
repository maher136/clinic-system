const express = require('express');
const bodyParser = require('body-parser');
const patientRoutes = require('./routes/patientRoutes');
const secretaryRoutes = require('./routes/secretaryRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();

const app = express(); 

const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/secretaries', secretaryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/doctors', doctorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', require('./routes/medicalDocumentRoutes')); 
app.use('/api/admins', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
