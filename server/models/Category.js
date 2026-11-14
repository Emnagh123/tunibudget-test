import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  kind: { type: String, enum: ['income', 'expense'], default: 'expense' },
}, { timestamps: true });
export default mongoose.model('Category', categorySchema);
