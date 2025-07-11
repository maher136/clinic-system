const db = require('../db');

exports.createAdmin = async (adminData) => {
  const { name, email, password } = adminData;
  const [result] = await db.promise().query(
    'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return result;
};

exports.getAllAdmins = async () => {
  const [rows] = await db.promise().query('SELECT id, name, email FROM admins');
  return rows;
};

exports.findAdminByEmail = async (email) => {
  const [rows] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
  return rows[0];
};
