const admin = require('firebase-admin');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const db = admin.firestore();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password} = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userSnapshot = await db.collection('user').where('email', '==', email).get();
  if (!userSnapshot.empty) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const userId = nanoid(15).toUpperCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection('user').doc(userId).set({
    userId,
    userName,
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'User registered successfully', userId });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userSnapshot = await db.collection('user').where('email', '==', email).get();
  if (userSnapshot.empty) {
    return res.status(401).json({ error: 'User not found' });
  }

  const userDoc = userSnapshot.docs[0];
  const userData = userDoc.data();

  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.status(200).json({
    message: 'Login successful',
    userId: userDoc.id,
    token: generateToken(userDoc.id),
  });
});

// Get user by Firestore docId
const getUserById = asyncHandler(async (req, res) => {
  const docId = req.params.userId;

  const userDoc = await db.collection('user').doc(docId).get();
  if (!userDoc.exists) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { userName, email, userId } = userDoc.data();
  res.json({ userName, email, userId });
});

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
