import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // admin rule
  const role = email.startsWith('admin@') ? 'admin' : 'customer';

  const user = await User.create({ name, email, password, role });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: generateToken(user._id)
  });
});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: generateToken(user._id)
  });
});

export default router;
