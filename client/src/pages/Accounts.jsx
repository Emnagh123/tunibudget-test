import { useState, useEffect } from 'react';
import Select from '../components/Select.jsx';
import Modal from '../components/Modal.jsx';

const TYPES = ['checking', 'savings', 'cash'].map((t) => ({ value: t, label: t }));

export default function Accounts({ accounts, setAccounts, log, intent, setIntent }) {
  const [modal, setModal] = useState(null);                 // null | 'account' | 'transfer'
  const [form, setForm] = useState({ id: null, name: '', type: 'checking' });
  const [tr, setTr] = useState({ from: '', to: '', amount: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const options = accounts.map((a) => ({ value: a.id, label: a.name }));

  const openAdd = () => { setForm({ id: null, name: '', type: 'checking' }); setError(''); setModal('account'); };
  const openEdit = (a) => { setForm({ id: a.id, name: a.name, type: a.type }); setError(''); setModal('account'); };
  const openTransfer = () => { setTr({ from: '', to: '', amount: '' }); setError(''); setModal('transfer'); };

  // quick actions on the dashboard open the right window directly
  useEffect(() => {
    if (intent === 'add') openAdd();
    if (intent === 'transfer') openTransfer();
    if (intent) setIntent(null);
  }, [intent]);

  const save = () => {
    if (!form.name.trim()) return setError('Enter an account name');
    if (form.id) { setAccounts(accounts.map((a) => (a.id === form.id ? { ...a, name: form.name, type: form.type } : a))); log('UPDATE', 'Account'); }
    else { setAccounts([...accounts, { id: Date.now(), name: form.name, type: form.type, balance: 0 }]); log('CREATE', 'Account'); }
    setModal(null);
  };
  const remove = (id) => { setAccounts(accounts.filter((a) => a.id !== id)); log('DELETE', 'Account'); };

  // Mock transfer: both steps happen together or none (the real API uses a MongoDB transaction)
  const transfer = () => {
    const from = accounts.find((a) => a.id === +tr.from), to = accounts.find((a) => a.id === +tr.to), amt = +tr.amount;
    if (!from || !to) return setError('Choose both accounts');
    if (from.id === to.id) return setError('Choose two different accounts');
    if (!(amt > 0)) return setError('Enter a valid amount');
    if (from.balance < amt) return setError('Insufficient funds: nothing was changed');
    setAccounts(accounts.map((a) => (a.id === from.id ? { ...a, balance: a.balance - amt } : a.id === to.id ? { ...a, balance: a.balance + amt } : a)));
    log('TRANSFER', 'Account'); setMsg(`Transferred ${amt} TND from ${from.name} to ${to.name}`); setModal(null);
  };

  return (
    <>
      <h1>Accounts</h1>
      <div className="row">
        <button onClick={openAdd}>＋ Add account</button>
        <button className="ghost" onClick={openTransfer}>⇄ New transfer</button>
      </div>
      {msg && <p className="notice">{msg}</p>}
      <div className="card"><table>
        <thead><tr><th>Name</th><th>Type</th><th>Balance (TND)</th><th></th></tr></thead>
        <tbody>{accounts.map((a) => (
          <tr key={a.id}><td><b>{a.name}</b></td><td><span className="type-pill">{a.type}</span></td><td>{a.balance.toFixed(2)}</td>
            <td className="actions-cell"><button className="ghost" onClick={() => openEdit(a)}>Edit</button>
              <button className="danger" onClick={() => remove(a.id)}>Delete</button></td></tr>))}
        </tbody></table></div>

      {modal === 'account' && (
        <Modal title={form.id ? 'Edit account' : 'Add account'} onClose={() => setModal(null)}>
          <div className="form">
            <input placeholder="Account name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={TYPES} />
            {error && <p className="error">{error}</p>}
            <div className="form-actions"><button className="ghost" onClick={() => setModal(null)}>Cancel</button>
              <button onClick={save}>{form.id ? 'Update' : 'Add account'}</button></div>
          </div>
        </Modal>)}

      {modal === 'transfer' && (
        <Modal title="Transfer between accounts" onClose={() => setModal(null)}>
          <div className="form">
            <Select value={tr.from} onChange={(v) => setTr({ ...tr, from: v })} options={options} placeholder="From…" />
            <Select value={tr.to} onChange={(v) => setTr({ ...tr, to: v })} options={options} placeholder="To…" />
            <input type="number" placeholder="Amount (TND)" value={tr.amount} onChange={(e) => setTr({ ...tr, amount: e.target.value })} />
            {error && <p className="error">{error}</p>}
            <div className="form-actions"><button className="ghost" onClick={() => setModal(null)}>Cancel</button>
              <button onClick={transfer}>Transfer</button></div>
          </div>
        </Modal>)}
    </>
  );
}
