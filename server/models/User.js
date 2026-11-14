import mongoose from 'mongoose';
// 3 roles: user (customer), auditor (read-only audit log), admin (manage users + audit log)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'auditor', 'admin'], default: 'user' },
  currency: { type: String, default: 'TND' },
  active: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.model('User', userSchema);
