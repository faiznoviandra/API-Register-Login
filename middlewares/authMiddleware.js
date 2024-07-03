const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi token JWT
exports.authMiddleware = (req, res, next) => {
  // Mendapatkan token dari header Authorization
  const token = req.header('Authorization');
  
  // Memeriksa apakah token ada
  if (!token) return res.status(401).send({ message: 'Access Denied' });

  try {
    // Verifikasi token menggunakan JWT_SECRET yang ada di environment
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Menyimpan data yang terverifikasi (biasanya berisi informasi pengguna) di request object
    req.user = verified;
    
    // Lanjut ke middleware atau handler berikutnya
    next();
  } catch (err) {
    // Jika token tidak valid, kirim respons error
    res.status(400).send({ message: 'Invalid Token' });
  }
};
