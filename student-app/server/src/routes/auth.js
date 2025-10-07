const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const allowedBands = new Set(['6-8', '9-12']);

router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password, grade_band } = req.body || {};

    if (!full_name || !email || !password || !grade_band) {
      res.status(400).json({ error: 'full_name, email, password, grade_band are required' });
      return;
    }
    if (!allowedBands.has(grade_band)) {
      res.status(400).json({ error: "grade_band must be '6-8' or '9-12'" });
      return;
    }

    const existing = await get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (full_name, email, password_hash, grade_band) VALUES (?, ?, ?, ?)',
      [full_name, email, password_hash, grade_band]
    );

    const user = { id: result.lastID, full_name, email, grade_band };
    const token = jwt.sign(user, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required' });
      return;
    }

    const userRow = await get('SELECT id, full_name, email, password_hash, grade_band FROM users WHERE email = ?', [email]);
    if (!userRow) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, userRow.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = { id: userRow.id, full_name: userRow.full_name, email: userRow.email, grade_band: userRow.grade_band };
    const token = jwt.sign(user, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
