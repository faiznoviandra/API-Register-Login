//  Untuk megabungkan file lain buat jalanin apl
// Mengimpor modul express untuk membangun aplikasi web
const express = require('express');

// Membuat instance dari express
const app = express();

// Mengimpor rute-rute autentikasi dari file auth.js di folder routes
const authRoutes = require('./routes/auth');

// Mengimpor konfigurasi database dari file db.js di folder config
const db = require('./config/db');

// Mengimpor middleware autentikasi (untuk digunakan jika diperlukan di masa depan)
const authMiddleware = require('./middlewares/authMiddleware');

// Menggunakan middleware express untuk parsing request body dengan format JSON
app.use(express.json());

// Mendaftarkan rute autentikasi di aplikasi Express
app.use(authRoutes);

// Menentukan port dari environment variables atau default ke 8080
const PORT = process.env.PORT || 8080;

// Memulai server dan mendengarkan koneksi pada port yang telah ditentukan
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Memeriksa koneksi ke database saat server mulai
  db.execute('SELECT 1')
    .then(() => {
      console.log('Database connection successful'); // Pesan sukses jika koneksi ke database berhasil
    })
    .catch((err) => {
      console.error('Database connection failed:', err); // Pesan error jika koneksi ke database gagal
    });
});
