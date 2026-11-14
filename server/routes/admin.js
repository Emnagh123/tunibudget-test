import { Router } from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { protect, allow } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';
const r = Router();
r.use(protect);
// auditor + admin can READ the audit log; only admin can manage users
r.get('/audit', allow('admin', 'auditor'), async (req, res) =>
  res.json(await AuditLog.find().sort('-createdAt').limit(200)));
r.get('/users', allow('admin'), async (req, res) => res.json(await User.find().select('-password')));
r.put('/users/:id', allow('admin'), async (req, res) => { // change role / enable-disable
  const { role, active } = req.body;
  const u = await User.findByIdAndUpdate(req.params.id, { role, active }, { new: true, runValidators: true }).select('-password');
  if (!u) return res.status(404).json({ message: 'User not found' });
  audit(req, 'UPDATE', 'User', u._id, { role, active });
  res.json(u);
});
export default r;
