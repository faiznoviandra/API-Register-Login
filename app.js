const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const db = require('./config/db');
const authMiddleware = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(authRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  db.execute('SELECT 1')
    .then(() => {
      console.log('Database connection successful');
    })
    .catch((err) => {
      console.error('Database connection failed:', err);
    });
});
