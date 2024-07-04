// Handle logika login

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// Fungsi untuk menghasilkan ID unik untuk pengguna
const generateUniqueId = () => {
  return 'user-' + crypto.randomBytes(8).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
};

// Controller untuk proses pendaftaran pengguna baru
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Respons jika ada kesalahan validasi
  }

  const { email, username, password } = req.body;

  try {
    // Memeriksa apakah email sudah terdaftar di database
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) {
      return res.status(400).json({ error: true, message: 'Email already exists' }); // Respons jika email sudah terdaftar
    }

    // Meng-generate salt dan meng-hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Menghasilkan ID unik untuk pengguna
    const userId = generateUniqueId();

    // Menyimpan data pengguna baru ke dalam database
    await db.execute('INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)', [userId, email, username, hashedPassword]);

    res.status(201).send({ error: false , message: 'User registered' }); // Respons jika pendaftaran berhasil

  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).send({ error: true ,message: 'Server error' }); // Respons jika terjadi kesalahan server
  }
};

// Controller untuk proses login pengguna
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Respons jika ada kesalahan validasi
  }

  const { email, password } = req.body;

  try {
    // Memeriksa keberadaan pengguna berdasarkan email
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: true, message: 'Invalid credentials' }); // Respons jika email tidak ditemukan
    }

    // Membandingkan password yang dimasukkan dengan password yang ter-hash di database
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: true, message: 'Invalid credentials' }); // Respons jika password tidak sesuai
    }

    // Menghasilkan token JWT untuk otentikasi
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).send({ 
      error: false,
      message: 'Login successful',
      loginResult: {
        userId: user[0].id,
        email: email,
        username: user[0].username,
        token
      } 
    });

  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).send({ error: true, message: 'Server error' }); // Respons jika terjadi kesalahan server
  }
};

// Controller untuk mengambil daftar item pakaian dengan opsi paginasi
exports.list = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Respons jika ada kesalahan validasi
  }

  const { page, size } = req.body;

  const pageNumber = page ? parseInt(page, 10) : 1;
  const pageSize = size ? parseInt(size, 10) : 10;
  const offset = (pageNumber - 1) * pageSize;

  try {
    // Menghitung total item pakaian
    const [totalCountResult] = await db.execute('SELECT COUNT(*) as total FROM clothing');
    const totalItems = totalCountResult[0].total;

    // Mengambil item pakaian dengan batasan jumlah dan offset sesuai dengan parameter paginasi
    const [clothingItems] = await db.execute('SELECT * FROM clothing LIMIT ? OFFSET ?', [pageSize, offset]);

    // Menyiapkan respons dengan informasi paginasi dan daftar item pakaian
    const response = {
      error: false,
      message: 'Clothing items fetched successfully',
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: pageNumber,
      pageSize: pageSize,
      clothingItems: clothingItems,
    };

    res.status(200).json(response); // Mengembalikan respons dengan daftar item pakaian

  } catch (err) {
    console.error('Error fetching clothing items:', err);
    res.status(500).send({ error: true, message: 'Server error' }); // Respons jika terjadi kesalahan server
  }
};

// Controller untuk proses logout pengguna
exports.logout = (req, res) => {
  // Menunggu implementasi untuk menghapus token di sisi klien (client-side)
  res.status(200).send({ error: false, message: 'Logout successful' }); // Respons logout berhasil
};
