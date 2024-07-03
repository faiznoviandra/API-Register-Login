// Mengimpor library mysql2 untuk koneksi ke database MySQL
const mysql = require('mysql2');  

// Mengimpor dan mengkonfigurasi dotenv untuk mengelola variabel lingkungan dari file .env
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,         // Mengambil host database dari variabel lingkungan
  user: process.env.DB_USER,         // Mengambil username database dari variabel lingkungan
  password: process.env.DB_PASSWORD, // Mengambil password database dari variabel lingkungan
  database: process.env.DB_NAME,     // Mengambil nama database dari variabel lingkungan
});

module.exports = pool.promise();    // Mengekspor pool koneksi sebagai promise

