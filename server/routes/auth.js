import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, saveDb } from '../db.js';

const router = express.Router();
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

router.post('/register', async (req, res) => {
  const { email, password, churchId, role } = req.body;

  try {
    const db = getDb();
    
    // Check if email already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.prepare(
      'INSERT INTO users (email, password, church_id, role) VALUES (?, ?, ?, ?)'
    ).run(email, hashedPassword, churchId, role);
    
    saveDb();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, churchId: user.church_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, churchId: user.church_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;