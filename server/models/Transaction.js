import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
  amount: { type: Number, required: true, min: 0.001 },
  description: String,
  date: { type: Date, default: Date.now },
  recurring: { type: String, enum: ['none', 'weekly', 'monthly'], default: 'none' },
  transferId: String, // links the 2 legs (debit + credit) of one transfer
}, { timestamps: true });
export default mongoose.model('Transaction', transactionSchema);
