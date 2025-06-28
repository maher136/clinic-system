const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // أو اسم المستخدم عندك
  password: '',       // أو كلمة المرور إذا عندك
  database: 'clinic_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL Database');
});

module.exports = connection;