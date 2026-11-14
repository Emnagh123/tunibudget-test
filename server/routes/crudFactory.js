import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

// Builds GET / POST / PUT / DELETE for any model owned by a user
export default function crudRouter(Model, name) {
  const r = Router();
  r.use(protect);
  r.get('/', async (req, res) => res.json(await Model.find({ owner: req.user._id }).sort('-createdAt')));
  r.post('/', async (req, res, next) => {
    try {
      const { balance, ...body } = req.body;
      const doc = await Model.create({ ...body, owner: req.user._id });
      audit(req, 'CREATE', name, doc._id);
      res.status(201).json(doc);
    } catch (e) { e.status = 400; next(e); }
  });
  r.put('/:id', async (req, res, next) => {
    try {
      const { owner, balance, ...safe } = req.body; // balance only changes through transactions/transfers
      const doc = await Model.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, safe, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: `${name} not found` });
      audit(req, 'UPDATE', name, doc._id);
      res.json(doc);
    } catch (e) { e.status = 400; next(e); }
  });
  r.delete('/:id', async (req, res) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!doc) return res.status(404).json({ message: `${name} not found` });
    audit(req, 'DELETE', name, doc._id);
    res.json({ message: 'Deleted' });
  });
  return r;
}
