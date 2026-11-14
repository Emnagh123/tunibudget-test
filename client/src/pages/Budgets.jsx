import { useState, useEffect } from 'react';
import Select from '../components/Select.jsx';
import Modal from '../components/Modal.jsx';
import { mockCategories } from '../mock/data.js';

const CATS = mockCategories.filter((c) => c !== 'Salary' && c !== 'Freelance').map((c) => ({ value: c, label: c }));

export default function Budgets({ budgets, setBudgets, transactions, log }) {
  const [form, setForm] = useState(null);           // null = window closed
  const [error, setError] = useState('');
  const [status, setStatus] = useState([]);
  const month = '2026-11';

  // Budget alerts: compare spending of the month with each limit
  useEffect(() => {
    setStatus(budgets.map((b) => {
      const used = transactions.filter((t) => t.type === 'expense' && t.category === b.category && t.date.startsWith(b.month))
        .reduce((s, t) => s + t.amount, 0);
      const percent = Math.round((used / b.limit) * 100);
      return { ...b, used, percent, level: percent >= 100 ? 'danger' : percent >= 80 ? 'warning' : 'ok' };
    }));
  }, [budgets, transactions]);

  const open = (b) => { setError(''); setForm(b ? { id: b.id, category: b.category, limit: b.limit } : { id: null, category: 'Food', limit: '' }); };
  const save = () => {
    const limit = +form.limit;
    if (!(limit > 0)) return setError('Enter a monthly limit');
    if (form.id) { setBudgets(budgets.map((b) => (b.id === form.id ? { ...b, limit } : b))); log('UPDATE', 'Budget'); }
    else {
      if (budgets.some((b) => b.category === form.category && b.month === month)) return setError('A budget already exists for this category');
      setBudgets([...budgets, { id: Date.now(), category: form.category, limit, month }]); log('CREATE', 'Budget');
    }
    setForm(null);
  };
  const remove = (id) => { setBudgets(budgets.filter((b) => b.id !== id)); log('DELETE', 'Budget'); };

  return (
    <>
      <h1>Budgets — {month}</h1>
      {status.filter((s) => s.level !== 'ok').map((s) => (
        <p key={s.id} className={`alert ${s.level}`}>⚠ You've used {s.percent}% of your {s.category} budget</p>))}
      <div className="row"><button onClick={() => open(null)}>＋ Add budget</button></div>
      {status.map((s) => (
        <div className="card" key={s.id}>
          <div className="row"><b>{s.category}</b><span>{s.used} / {s.limit} TND ({s.percent}%)</span>
            <button className="ghost" onClick={() => open(s)}>Edit</button>
            <button className="danger" onClick={() => remove(s.id)}>Delete</button></div>
          <div className="bar"><div className={`fill ${s.level}`} style={{ width: `${Math.min(s.percent, 100)}%` }} /></div>
        </div>))}

      {form && (
        <Modal title={form.id ? `Edit ${form.category} budget` : 'Add budget'} onClose={() => setForm(null)}>
          <div className="form">
            {!form.id && <Select value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={CATS} />}
            <input type="number" placeholder="Monthly limit (TND)" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
            {error && <p className="error">{error}</p>}
            <div className="form-actions"><button className="ghost" onClick={() => setForm(null)}>Cancel</button>
              <button onClick={save}>{form.id ? 'Update' : 'Add budget'}</button></div>
          </div>
        </Modal>)}
    </>
  );
}
