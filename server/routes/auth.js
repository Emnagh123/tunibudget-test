import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

const r = Router();
const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

r.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Name, email and a 6+ char password are required' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already used' });
    // role is ALWAYS "user" here: nobody can self-register as admin
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    await Category.insertMany(['Food', 'Transport', 'Rent', 'Leisure'].map((n) => ({ owner: user._id, name: n })));
    res.status(201).json({ token: sign(user), user: { id: user._id, name, email, role: user.role } });
  } catch (e) { next(e); }
});

r.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.active || !(await bcrypt.compare(req.body.password || '', user.password)))
    return res.status(401).json({ message: 'Wrong email or password' });
  req.user = user; audit(req, 'LOGIN', 'User', user._id);
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

r.get('/me', protect, (req, res) => res.json(req.user));
export default r;
