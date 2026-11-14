import mongoose from 'mongoose';
const budgetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  month: { type: String, required: true }, // "2026-11"
  limit: { type: Number, required: true, min: 1 },
}, { timestamps: true });
budgetSchema.index({ owner: 1, category: 1, month: 1 }, { unique: true });
export default mongoose.model('Budget', budgetSchema);
