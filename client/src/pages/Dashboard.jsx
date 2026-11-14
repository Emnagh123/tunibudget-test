import { useState, useEffect } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#a3e635', '#f5c04a', '#2dd4bf', '#15803d', '#facc15', '#86efac', '#65a30d', '#4ade80'];
// dark tooltip with readable text
const tip = { contentStyle: { background: '#0e1511', border: '1px solid #22c55e55', borderRadius: 12, color: '#eef6f0' },
  itemStyle: { color: '#eef6f0' }, labelStyle: { color: '#a3e635' } };
const legend = (v) => <span style={{ color: '#cfe0d5' }}>{v}</span>;

export default function Dashboard({ accounts, transactions, go }) {
  const [byCategory, setByCategory] = useState([]);
  const [monthly, setMonthly] = useState([]);

  // Recompute chart data whenever transactions change
  useEffect(() => {
    const cat = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => (cat[t.category] = (cat[t.category] || 0) + t.amount));
    setByCategory(Object.entries(cat).map(([name, value]) => ({ name, value })));
    const m = {};
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      m[key] = m[key] || { month: key, income: 0, expense: 0 };
      if (t.type === 'income') m[key].income += t.amount;
      if (t.type === 'expense') m[key].expense += t.amount;
    });
    setMonthly(Object.values(m).sort((a, b) => a.month.localeCompare(b.month)));
  }, [transactions]);

  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  // [icon, label, page, window to open]
  const actions = [['＋', 'Add account', 'accounts', 'add'], ['↗', 'Send', 'accounts', 'transfer'], ['≡', 'History', 'transactions', null], ['⋯', 'Loan', 'simulator', null]];

  return (
    <>
      <div className="hero">
        <small>Total balance</small>
        <div className="amount">{total.toLocaleString('en', { minimumFractionDigits: 2 })} TND</div>
        <span className="pill">↗ {accounts.length} accounts</span>
        <div className="actions">
          {actions.map(([icon, label, page, intent]) => (
            <button key={label} onClick={() => go(page, intent)}><i>{icon}</i>{label}</button>))}
        </div>
      </div>
      <div className="grid">
        <div className="card"><h3>Income vs expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5c04a" stopOpacity={0.4} /><stop offset="100%" stopColor="#f5c04a" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#7f9187" /><YAxis stroke="#7f9187" /><Tooltip {...tip} /><Legend formatter={legend} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2.5} fill="url(#gi)" />
              <Area type="monotone" dataKey="expense" stroke="#f5c04a" strokeWidth={2.5} fill="url(#ge)" />
            </AreaChart>
          </ResponsiveContainer></div>
        <div className="card"><h3>Spending by category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} stroke="none">
              {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip {...tip} formatter={(v) => `${v} TND`} /><Legend formatter={legend} /></PieChart>
          </ResponsiveContainer></div>
      </div>
      <div className="card"><h3>Recent transactions</h3>
        {recent.map((t) => (
          <div className="tx" key={t.id}>
            <div className={`ic ${t.type === 'income' ? '' : 'out'}`}>{t.type === 'income' ? '↙' : '↗'}</div>
            <div className="d">{t.description}<br /><small>{t.category} · {t.date}</small></div>
            <b className={t.type}>{t.type === 'income' ? '+' : '-'}{t.amount} TND</b>
          </div>))}
      </div>
    </>
  );
}
