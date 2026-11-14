import { useState, useEffect } from 'react';
import { mockUsers, mockAccounts, mockTransactions, mockBudgets, mockAudit } from './mock/data.js';
import Dashboard from './pages/Dashboard.jsx';
import Accounts from './pages/Accounts.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Simulator from './pages/Simulator.jsx';
import Admin from './pages/Admin.jsx';

// Which pages each role can see
const MENU = [
  { id: 'dashboard', label: 'Dashboard', roles: ['user'] },
  { id: 'accounts', label: 'Accounts & Transfers', roles: ['user'] },
  { id: 'transactions', label: 'Transactions', roles: ['user'] },
  { id: 'budgets', label: 'Budgets', roles: ['user'] },
  { id: 'simulator', label: 'Loan Simulator', roles: ['user'] },
  { id: 'admin', label: 'Admin / Audit', roles: ['admin', 'auditor'] },
];

// Small SVG icons (no library needed)
const svg = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const EyeIcon = ({ off }) => off ? (
  <svg {...svg}><path d="M3 3l18 18" /><path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c5 0 8.5 4 10 6-0.7 1-1.8 2.3-3.3 3.4M6.6 6.7C4.5 8.1 3 10 2 12c1.5 2 5 6 10 6 1.5 0 2.8-.3 4-.9" /><path d="M9.9 10a3 3 0 0 0 4.1 4.1" /></svg>
) : (
  <svg {...svg}><path d="M2 12c1.5-2 5-6 10-6s8.5 4 10 6c-1.5 2-5 6-10 6S3.5 14 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
const LogoutIcon = () => (
  <svg {...svg}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
);

export default function App() {
  const [user, setUser] = useState(null);          // logged-in user (null = login screen)
  const [page, setPage] = useState('dashboard');
  const [intent, setIntent] = useState(null);      // which window a quick action wants opened ('add', 'transfer')
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);

  // "Fetch" mock data once the user logs in (later: real API calls)
  useEffect(() => {
    if (!user) return;
    setAccounts(mockAccounts); setTransactions(mockTransactions);
    setBudgets(mockBudgets); setUsers(mockUsers); setAudit(mockAudit);
    setPage(user.role === 'user' ? 'dashboard' : 'admin');
  }, [user]);

  const go = (p, i = null) => { setIntent(i); setPage(p); };
  const log = (action, entity) =>
    setAudit((a) => [{ id: Date.now(), actor: user.email, action, entity, when: new Date().toLocaleString() }, ...a]);

  if (!user) return <Login onLogin={setUser} />;

  const props = { accounts, setAccounts, transactions, setTransactions, budgets, setBudgets, users, setUsers, audit, log, user, go, intent, setIntent };
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Tuni<span>Budget</span></h2>
        <nav className="nav">
          {MENU.filter((m) => m.roles.includes(user.role)).map((m) => (
            <button key={m.id} className={page === m.id ? 'active' : ''} onClick={() => go(m.id)}>{m.label}</button>
          ))}
        </nav>
        <div className="user-chip">
          <div className="avatar-chip" title={`${user.name} (${user.role})`}>
            <div className="avatar">{user.name[0].toUpperCase()}</div>
            <span>{user.name}</span>
          </div>
          <button className="logout" aria-label="Log out" onClick={() => setUser(null)}><LogoutIcon /><span>Log out</span></button>
        </div>
      </aside>
      <main>
        {page === 'dashboard' && <Dashboard {...props} />}
        {page === 'accounts' && <Accounts {...props} />}
        {page === 'transactions' && <Transactions {...props} />}
        {page === 'budgets' && <Budgets {...props} />}
        {page === 'simulator' && <Simulator />}
        {page === 'admin' && <Admin {...props} />}
      </main>
    </div>
  );
}

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');       // 'login' | 'forgot' | 'code'
  const [email, setEmail] = useState('user@tunibudget.tn');
  const [password, setPassword] = useState('Test1234');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  // forgot-password flow
  const [contact, setContact] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');

  const go = (m) => { setMode(m); setError(''); };

  const submit = () => {
    const u = mockUsers.find((x) => x.email === email.trim().toLowerCase());
    if (!u || u.password !== password) return setError('Wrong email or password');
    if (!u.active) return setError('This account is disabled');
    onLogin(u);
  };

  const sendCode = () => {
    const value = contact.trim().toLowerCase();
    const digits = value.replace(/\D/g, '');
    const u = mockUsers.find((x) => x.email === value || (digits.length >= 8 && x.phone.replace(/\D/g, '').endsWith(digits)));
    if (!u) return setError('No account found with this email or phone number');
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(c); setTargetUser(u); setCode(''); go('code');
    // DEMO: in the real app the backend sends this code by email (Nodemailer) or SMS (Twilio)
    setInfo(`Demo mode: your code is ${c}`);
  };

  const resetPassword = () => {
    if (code !== sentCode) return setError('Wrong code');
    if (newPw.length < 6) return setError('Password must have at least 6 characters');
    if (newPw !== newPw2) return setError('Passwords do not match');
    targetUser.password = newPw;                   // mock: changes the password in memory
    setEmail(targetUser.email); setPassword(''); setNewPw(''); setNewPw2('');
    setInfo('Password changed. You can log in now.'); go('login');
  };

  const quick = (e) => { setEmail(e); setPassword('Test1234'); setError(''); setInfo(''); };
  const enter = (fn) => (e) => e.key === 'Enter' && fn();

  return (
    <div className="login card">
      <div className="coin">$</div>
      <h1>Maintain your personal finance, made simple</h1>
      <p>Smart personal finance &amp; mini-banking in TND.</p>

      {mode === 'login' && <>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <div className="pw">
          <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={enter(submit)} placeholder="Password" />
          <button type="button" className="eye" aria-label={showPw ? 'Hide password' : 'Show password'}
            onClick={() => setShowPw(!showPw)}><EyeIcon off={showPw} /></button>
        </div>
        <button className="link" onClick={() => go('forgot')}>Forgot password?</button>
        {error && <p className="error">{error}</p>}
        {info && <p className="notice">{info}</p>}
        <button onClick={submit}>Start now</button>
        <small>Quick test login (password Test1234):</small>
        <div className="quick">
          <button className="ghost" onClick={() => quick('user@tunibudget.tn')}>User</button>
          <button className="ghost" onClick={() => quick('auditor@tunibudget.tn')}>Auditor</button>
          <button className="ghost" onClick={() => quick('admin@tunibudget.tn')}>Admin</button>
        </div>
      </>}

      {mode === 'forgot' && <>
        <h3>Reset your password</h3>
        <input value={contact} onChange={(e) => setContact(e.target.value)} onKeyDown={enter(sendCode)}
          placeholder="Email or phone number (+216...)" />
        {error && <p className="error">{error}</p>}
        <button onClick={sendCode}>Send code</button>
        <button className="link" onClick={() => go('login')}>Back to login</button>
      </>}

      {mode === 'code' && <>
        <h3>Enter the code</h3>
        {info && <p className="notice">{info}</p>}
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" maxLength={6} />
        <div className="pw">
          <input type={showPw ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password" />
          <button type="button" className="eye" aria-label={showPw ? 'Hide password' : 'Show password'}
            onClick={() => setShowPw(!showPw)}><EyeIcon off={showPw} /></button>
        </div>
        <input type={showPw ? 'text' : 'password'} value={newPw2} onChange={(e) => setNewPw2(e.target.value)}
          onKeyDown={enter(resetPassword)} placeholder="Confirm new password" />
        {error && <p className="error">{error}</p>}
        <button onClick={resetPassword}>Change password</button>
        <button className="link" onClick={() => go('login')}>Back to login</button>
      </>}
    </div>
  );
}
