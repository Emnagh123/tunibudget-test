import { Router } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

const r = Router();
r.use(protect);

// ACID transfer: debit + credit + 2 ledger rows succeed TOGETHER or NOT AT ALL
r.post('/', async (req, res) => {
  const { from, to, amount, description } = req.body;
  const amt = Number(amount);
  if (!amt || amt <= 0 || from === to) return res.status(400).json({ message: 'Invalid transfer' });

  const session = await mongoose.startSession();
  const transferId = crypto.randomUUID();
  try {
    await session.withTransaction(async () => {
      // the filter {balance >= amt} makes the check + debit ONE atomic step (no race condition)
      const debited = await Account.findOneAndUpdate(
        { _id: from, owner: req.user._id, balance: { $gte: amt } }, { $inc: { balance: -amt } }, { session });
      if (!debited) throw Object.assign(new Error('Insufficient funds or account not found'), { status: 400 });
      const credited = await Account.findOneAndUpdate(
        { _id: to, owner: req.user._id }, { $inc: { balance: amt } }, { session });
      if (!credited) throw Object.assign(new Error('Destination account not found'), { status: 404 }); // => rollback of the debit
      await Transaction.create([
        { owner: req.user._id, account: from, type: 'transfer', amount: amt, description: `Transfer out: ${description || ''}`, transferId },
        { owner: req.user._id, account: to, type: 'transfer', amount: amt, description: `Transfer in: ${description || ''}`, transferId },
      ], { session });
    });
    audit(req, 'TRANSFER', 'Account', from, { to, amount: amt, transferId });
    res.status(201).json({ message: 'Transfer completed', transferId });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  } finally { session.endSession(); }
});
export default r;
