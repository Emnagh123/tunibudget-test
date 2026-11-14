import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1) Is the user logged in? (reads "Authorization: Bearer <token>")
export async function protect(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select('-password');
    if (!user || !user.active) return res.status(401).json({ message: 'Account disabled' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
// 2) Does the user have the right role?  usage: allow('admin', 'auditor')
export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden for your role' });
