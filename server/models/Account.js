import mongoose from 'mongoose';
const accountSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['checking', 'savings', 'cash'], default: 'checking' },
  balance: { type: Number, default: 0, min: 0 }, // never negative: protects transfers
  currency: { type: String, default: 'TND' },
}, { timestamps: true });
export default mongoose.model('Account', accountSchema);
