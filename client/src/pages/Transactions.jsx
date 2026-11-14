import { useState } from 'react';
import Select from '../components/Select.jsx';
import Modal from '../components/Modal.jsx';
import { mockCategories } from '../mock/data.js';

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ id: null, accountId: '', type: 'expense', category: 'Food', amount: '', description: '', date: today() });
const CATS = mockCategories.map((c) => ({ value: c, label: c }));
const TYPES = [{ value: 'expense', label: 'Expense' }, { value: 'income', label: 'Income' }];
const FILTERS = [{ value: 'all', label: 'All' }, { value: 'income', label: 'Income' }, { value: 'expense', label: 'Expenses' }];

export default function Transactions({ accounts, setAccounts, transactions, setTransactions, log }) {
  const [form, setForm] = useState(null);            // null = window closed
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const set = (k) => (v) => setForm({ ...form, [k]: v });
  const open = (t) => { setError(''); setForm(t ? { ...t } : blank()); };
  const accName = (id) => accounts.find((a) => a.id === id)?.name || '—';
  const accOptions = accounts.map((a) => ({ value: a.id, label: a.name }));

  const save = () => {
    if (form.id) {   // edit: description / category / date only, so balances stay correct
      setTransactions(transactions.map((t) => (t.id === form.id ? { ...t, description: form.description, category: form.category, date: form.date } : t)));
      log('UPDATE', 'Transaction'); return setForm(null);
    }
    const amount = +form.amount, accountId = +form.accountId;
    if (!accountId) return setError('Choose an account');
    if (!(amount > 0)) return setError('Enter a valid amount');
    const delta = form.type === 'income' ? amount : -amount;
    const acc = accounts.find((a) => a.id === accountId);
    if (acc.balance + delta < 0) return setError('Insufficient funds in this account');
    setTransactions([{ ...form, id: Date.now(), amount, accountId }, ...transactions]);
    setAccounts(accounts.map((a) => (a.id === accountId ? { ...a, balance: a.balance + delta } : a)));
    log('CREATE', 'Transaction'); setForm(null);
  };
  const remove = (t) => {
    const delta = t.type === 'income' ? -t.amount : t.amount; // reverse the effect
    setAccounts(accounts.map((a) => (a.id === t.accountId ? { ...a, balance: a.balance + delta } : a)));
    setTransactions(transactions.filter((x) => x.id !== t.id)); log('DELETE', 'Transaction');
  };
  const exportCsv = () => {
    const rows = ['date,type,amount,category,description', ...transactions.map((t) => `${t.date},${t.type},${t.amount},${t.category},"${t.description}"`)];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    a.download = 'tunibudget.csv'; a.click();
  };
  const shown = transactions.filter((t) => filter === 'all' || t.type === filter);

  return (
    <>
      <h1>Transactions</h1>
      <div className="row">
        <button onClick={() => open(null)}>＋ Add transaction</button>
        <Select value={filter} onChange={setFilter} options={FILTERS} />
        <button className="ghost" onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="card"><table>
        <thead><tr><th>Date</th><th>Account</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr></thead>
        <tbody>{shown.map((t) => (
          <tr key={t.id}><td>{t.date}</td><td>{accName(t.accountId)}</td><td><span className="type-pill">{t.category}</span></td><td>{t.description}</td>
            <td className={t.type}>{t.type === 'income' ? '+' : '-'}{t.amount}</td>
            <td className="actions-cell"><button className="ghost" onClick={() => open(t)}>Edit</button>
              <button className="danger" onClick={() => remove(t)}>Delete</button></td></tr>))}
        </tbody></table></div>

      {form && (
        <Modal title={form.id ? 'Edit transaction' : 'Add transaction'} onClose={() => setForm(null)}>
          <div className="form">
            {!form.id && <>
              <Select value={form.accountId} onChange={set('accountId')} options={accOptions} placeholder="Account…" />
              <Select value={form.type} onChange={set('type')} options={TYPES} />
              <input type="number" placeholder="Amount (TND)" value={form.amount} onChange={(e) => set('amount')(e.target.value)} />
            </>}
            <Select value={form.category} onChange={set('category')} options={CATS} />
            <input placeholder="Description" value={form.description} onChange={(e) => set('description')(e.target.value)} />
            <input type="date" value={form.date} onChange={(e) => set('date')(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <div className="form-actions"><button className="ghost" onClick={() => setForm(null)}>Cancel</button>
              <button onClick={save}>{form.id ? 'Update' : 'Add'}</button></div>
          </div>
        </Modal>)}
    </>
  );
}
