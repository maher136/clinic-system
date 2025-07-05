const db = require('../db');

exports.createSecretary = async (secretaryData) => {
  const { name, email, phone, password } = secretaryData;
  const sql = 'INSERT INTO secretaries (name, email, phone, password) VALUES (?, ?, ?, ?)';
  const [result] = await db.promise().query(sql, [name, email, phone, password]);
  return result;
};
