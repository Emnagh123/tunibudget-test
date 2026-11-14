// MOCK DATA: replace each export by a fetch() to the API when the backend is ready.
export const mockUsers = [
  { id: 1, name: 'Emna', email: 'user@tunibudget.tn', phone: '+21620123456', password: 'Test1234', role: 'user', active: true },
  { id: 2, name: 'Auditor', email: 'auditor@tunibudget.tn', phone: '+21621123456', password: 'Test1234', role: 'auditor', active: true },
  { id: 3, name: 'Admin', email: 'admin@tunibudget.tn', phone: '+21622123456', password: 'Test1234', role: 'admin', active: true },
  { id: 4, name: 'Sami', email: 'sami@mail.tn', phone: '+21623123456', password: 'Test1234', role: 'user', active: true },
];

export const mockAccounts = [
  { id: 1, name: 'Banque de Tunisie (BT)', type: 'checking', balance: 2450.5 },
  { id: 2, name: 'Attijari bank', type: 'savings', balance: 8200 },
  { id: 3, name: 'BIAT', type: 'checking', balance: 1630.25 },
  { id: 4, name: 'STB', type: 'savings', balance: 4100 },
  { id: 5, name: 'BNA', type: 'checking', balance: 980 },
  { id: 6, name: 'Amen Bank', type: 'checking', balance: 1275.8 },
  { id: 7, name: 'Zitouna Bank', type: 'savings', balance: 3500 },
  { id: 8, name: 'La Poste Tunisienne (CCP)', type: 'checking', balance: 420 },
  { id: 9, name: 'Cash', type: 'cash', balance: 120 },
];

export const mockCategories = ['Food', 'Transport', 'Rent', 'Leisure', 'Bills', 'Health', 'Shopping', 'Salary', 'Freelance'];

export const mockTransactions = [
  { id: 1, accountId: 1, type: 'income', category: 'Salary', amount: 2200, description: 'November salary', date: '2026-11-01' },
  { id: 2, accountId: 1, type: 'expense', category: 'Rent', amount: 700, description: 'Rent', date: '2026-11-02' },
  { id: 3, accountId: 3, type: 'expense', category: 'Food', amount: 340, description: 'Groceries (Monoprix)', date: '2026-11-05' },
  { id: 4, accountId: 9, type: 'expense', category: 'Transport', amount: 60, description: 'Taxi + metro', date: '2026-11-07' },
  { id: 5, accountId: 6, type: 'expense', category: 'Leisure', amount: 90, description: 'Cinema', date: '2026-11-09' },
  { id: 6, accountId: 5, type: 'expense', category: 'Bills', amount: 85, description: 'STEG electricity', date: '2026-11-10' },
  { id: 7, accountId: 8, type: 'expense', category: 'Bills', amount: 45, description: 'Ooredoo internet', date: '2026-11-11' },
  { id: 8, accountId: 3, type: 'income', category: 'Freelance', amount: 450, description: 'Website project', date: '2026-11-12' },
  { id: 9, accountId: 1, type: 'income', category: 'Salary', amount: 2100, description: 'October salary', date: '2026-10-01' },
  { id: 10, accountId: 1, type: 'expense', category: 'Rent', amount: 700, description: 'Rent', date: '2026-10-02' },
  { id: 11, accountId: 3, type: 'expense', category: 'Food', amount: 310, description: 'Groceries', date: '2026-10-12' },
  { id: 12, accountId: 6, type: 'expense', category: 'Health', amount: 120, description: 'Pharmacy', date: '2026-10-15' },
  { id: 13, accountId: 4, type: 'expense', category: 'Shopping', amount: 260, description: 'Winter clothes', date: '2026-10-20' },
  { id: 14, accountId: 9, type: 'expense', category: 'Transport', amount: 75, description: 'Fuel', date: '2026-10-22' },
  { id: 15, accountId: 1, type: 'income', category: 'Salary', amount: 2100, description: 'September salary', date: '2026-09-01' },
  { id: 16, accountId: 1, type: 'expense', category: 'Rent', amount: 700, description: 'Rent', date: '2026-09-02' },
  { id: 17, accountId: 3, type: 'expense', category: 'Food', amount: 290, description: 'Groceries', date: '2026-09-10' },
  { id: 18, accountId: 7, type: 'income', category: 'Freelance', amount: 600, description: 'Logo design', date: '2026-09-18' },
  { id: 19, accountId: 5, type: 'expense', category: 'Leisure', amount: 150, description: 'Weekend in Hammamet', date: '2026-09-25' },
];

export const mockBudgets = [
  { id: 1, category: 'Food', limit: 400, month: '2026-11' },
  { id: 2, category: 'Transport', limit: 100, month: '2026-11' },
  { id: 3, category: 'Leisure', limit: 90, month: '2026-11' },
  { id: 4, category: 'Bills', limit: 150, month: '2026-11' },
];

export const mockAudit = [
  { id: 1, actor: 'user@tunibudget.tn', action: 'LOGIN', entity: 'User', when: '2026-11-14 09:02' },
  { id: 2, actor: 'user@tunibudget.tn', action: 'CREATE', entity: 'Transaction', when: '2026-11-14 09:05' },
  { id: 3, actor: 'admin@tunibudget.tn', action: 'UPDATE', entity: 'User', when: '2026-11-14 09:30' },
];
