const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Admin.createAdmin({ name, email, password: hashedPassword });

    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: result.insertId
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
