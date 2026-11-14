import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';
const r = Router();
r.get('/', protect, async (req, res) => {
  const match = { owner: req.user._id };
  const byCategory = await Transaction.aggregate([
    { $match: { ...match, type: 'expense' } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'c' } },
    { $project: { name: { $ifNull: [{ $arrayElemAt: ['$c.name', 0] }, 'Other'] }, total: 1, _id: 0 } },
  ]);
  const monthly = await Transaction.aggregate([
    { $match: { ...match, type: { $in: ['income', 'expense'] } } },
    { $group: { _id: { m: { $dateToString: { format: '%Y-%m', date: '$date' } }, t: '$type' }, total: { $sum: '$amount' } } },
    { $sort: { '_id.m': 1 } },
  ]);
  res.json({ byCategory, monthly });
});
export default r;
