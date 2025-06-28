const db = require('../db');

exports.createSecretary = (secretaryData, callback) => {
    const { name, email, phone, password } = secretaryData;
    const sql = 'INSERT INTO secretaries (name, email, phone, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, password], callback);
};