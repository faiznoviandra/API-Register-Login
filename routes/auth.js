// Mengimpor modul yang dibutuhkan dari package express dan express-validator
const express = require('express');
const { check, validationResult } = require('express-validator');

// Membuat instance Router dari Express untuk menangani rute-rute
const router = express.Router();

// Mengimpor controller untuk autentikasi
const authController = require('../controllers/authController');

// Mengimpor middleware untuk autentikasi (digunakan pada rute yang membutuhkan autentikasi)
const authMiddleware = require('../middlewares/authMiddleware');

// Rute POST untuk registrasi pengguna baru
router.post(
  '/register', // URL endpoint untuk registrasi
  [
    // Validasi input menggunakan express-validator
    check('email', 'Email is required').not().isEmpty(), // Memeriksa bahwa email tidak kosong
    check('username', 'Username is required').not().isEmpty(), // Memeriksa bahwa username tidak kosong
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }), // Memeriksa bahwa password minimal 6 karakter
  ],
  (req, res, next) => {
    // Menangani hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Jika ada error dalam validasi, kirimkan respons status 400 dengan daftar error
      return res.status(400).json({ errors: errors.array() });
    }
    // Jika validasi berhasil, lanjutkan ke fungsi register di authController
    authController.register(req, res, next);
  }
);

// Rute POST untuk login pengguna
router.post(
  '/login', // URL endpoint untuk login
  [
    // Validasi input menggunakan express-validator
    check('email', 'Email is required').not().isEmpty(), // Memeriksa bahwa email tidak kosong
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }), // Memeriksa bahwa password minimal 6 karakter
  ],
  (req, res, next) => {
    // Menangani hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Jika ada error dalam validasi, kirimkan respons status 400 dengan daftar error
      return res.status(400).json({ errors: errors.array() });
    }
    // Jika validasi berhasil, lanjutkan ke fungsi login di authController
    authController.login(req, res, next);
  }
);

// Mengekspor router untuk digunakan di file utama aplikasi
module.exports = router;
