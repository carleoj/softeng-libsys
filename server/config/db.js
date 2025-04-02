require('dotenv').config()
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

db.getConnection()
  .then(() => console.log('Connected to the MySQL database'))
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Stop the server if the DB isn't connected
  })

module.exports = db;
