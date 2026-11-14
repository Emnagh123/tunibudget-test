import { Router } from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import crudRouter from './crudFactory.js';
import { protect } from '../middleware/auth.js';

const r = Router();
// Budget alerts: GET /api/budgets/status?month=2026-11
r.get('/status', protect, async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const start = new Date(`${month}-01`), end = new Date(start); end.setMonth(end.getMonth() + 1);
  const budgets = await Budget.find({ owner: req.user._id, month }).populate('category', 'name');
  const spent = await Transaction.aggregate([
    { $match: { owner: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  res.json(budgets.map((b) => {
    const used = spent.find((s) => String(s._id) === String(b.category._id))?.total || 0;
    const percent = Math.round((used / b.limit) * 100);
    return { id: b._id, category: b.category.name, limit: b.limit, used, percent,
      level: percent >= 100 ? 'danger' : percent >= 80 ? 'warning' : 'ok',
      message: percent >= 80 ? `You've used ${percent}% of your ${b.category.name} budget` : null };
  }));
});
r.use('/', crudRouter(Budget, 'Budget'));
export default r;
