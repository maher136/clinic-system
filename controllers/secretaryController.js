const bcrypt = require('bcryptjs');
const Secretary = require('../models/secretaryModel');

// تسجيل سكرتير جديد
exports.registerSecretary = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Secretary.createSecretary({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Secretary registered successfully',
      secretaryId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating secretary:', error);
    res.status(500).json({ error: 'Failed to create secretary' });
  }
};

// إضافة مريض - مثال فارغ مؤقتاً
exports.addPatient = async (req, res) => {
  return res.status(200).json({ message: 'Add patient endpoint works' });
};

// تعديل مريض - مثال فارغ مؤقتاً
exports.updatePatient = async (req, res) => {
  return res.status(200).json({ message: 'Update patient endpoint works' });
};

// حذف مريض - مثال فارغ مؤقتاً
exports.deletePatient = async (req, res) => {
  return res.status(200).json({ message: 'Delete patient endpoint works' });
};
