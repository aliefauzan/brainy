const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Firebase Admin
const serviceAccount = require(path.join(__dirname, 'serviceAccountKeys.json'));


admin.initializeApp({
  credential : admin.credential.cert('./serviceAccountKeys.json')
});

// Export db untuk digunakan di controller lain
const db = admin.firestore();
module.exports.db = db;

// Middleware JSON parser
app.use(express.json());

// Route contoh (bisa dihapus kalau sudah pakai router utama)
app.get('/', (req, res) => {
  res.send('Server berjalan dengan Firestore');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Gunakan routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
