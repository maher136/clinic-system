const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// تسجيل الدخول
const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required.' });
  }

  let tableName = '';
  if (role === 'doctor') {
    tableName = 'doctors';
  } else if (role === 'secretary') {
    tableName = 'secretaries';
  } else if (role === 'patient') {
    tableName = 'patients';
  } else if (role === 'admin') {
   tableName = 'admins';
  }
    else {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM ${tableName} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// إعادة تعيين كلمة المرور
const resetPassword = async (req, res) => {
  const { email, newPassword, role } = req.body;

  if (!email || !newPassword || !role) {
    return res.status(400).json({ message: 'Email, new password, and role are required.' });
  }

  let tableName = '';
  if (role === 'doctor') {
    tableName = 'doctors';
  } else if (role === 'secretary') {
    tableName = 'secretaries';
  } else if (role === 'patient') {
    tableName = 'patients';
  }
  else if (role === 'admin') {
  tableName = 'admins';
  } else {
    return res.status(400).json({ message: 'Invalid role.' });
  }
 
  

  try {
    const [rows] = await db.promise().query(
      `SELECT * FROM ${tableName} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.promise().query(
      `UPDATE ${tableName} SET password = ? WHERE email = ?`,
      [hashedPassword, email]
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ التصدير الصحيح للدالتين
module.exports = {
  login,
  resetPassword
};
