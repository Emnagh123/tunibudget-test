import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import { protect } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

const r = Router();
r.use(protect);
const sign = (t) => (t.type === 'income' ? 1 : -1) * t.amount; // income +, expense -

r.get('/', async (req, res) => {
  const { month, account, category } = req.query; // ?month=2026-11
  const q = { owner: req.user._id };
  if (account) q.account = account;
  if (category) q.category = category;
  if (month) {
    const start = new Date(`${month}-01`), end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    q.date = { $gte: start, $lt: end };
  }
  res.json(await Transaction.find(q).sort('-date'));
});

r.post('/', async (req, res, next) => {
  try {
    const { account, type } = req.body;
    if (!['income', 'expense'].includes(type)) return res.status(400).json({ message: 'Use /transfers for transfers' });
    const acc = await Account.findOne({ _id: account, owner: req.user._id });
    if (!acc) return res.status(404).json({ message: 'Account not found' });
    const t = new Transaction({ ...req.body, owner: req.user._id });
    if (acc.balance + sign(t) < 0) return res.status(400).json({ message: 'Insufficient funds' });
    await t.save();
    await Account.updateOne({ _id: acc._id }, { $inc: { balance: sign(t) } });
    audit(req, 'CREATE', 'Transaction', t._id, { amount: t.amount, type });
    res.status(201).json(t);
  } catch (e) { e.status = 400; next(e); }
});

r.put('/:id', async (req, res, next) => { // only non-money fields, keeps balances consistent
  try {
    const { description, category, date, recurring } = req.body;
    const t = await Transaction.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { description, category, date, recurring }, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    audit(req, 'UPDATE', 'Transaction', t._id);
    res.json(t);
  } catch (e) { next(e); }
});

r.delete('/:id', async (req, res) => { // reverses the effect on the balance
  const t = await Transaction.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!t) return res.status(404).json({ message: 'Not found' });
  if (t.type !== 'transfer') await Account.updateOne({ _id: t.account }, { $inc: { balance: -sign(t) } });
  audit(req, 'DELETE', 'Transaction', t._id);
  res.json({ message: 'Deleted' });
});

// CSV export  (declared before /:id routes would matter only for GET /:id, none here)
r.get('/export/csv', async (req, res) => {
  const rows = await Transaction.find({ owner: req.user._id }).sort('-date');
  const csv = ['date,type,amount,description'].concat(
    rows.map((t) => `${t.date.toISOString().slice(0, 10)},${t.type},${t.amount},"${(t.description || '').replace(/"/g, '""')}"`)).join('\n');
  res.header('Content-Type', 'text/csv').attachment('tunibudget.csv').send(csv);
});
export default r;
