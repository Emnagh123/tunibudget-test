import { Router } from 'express';
import auth from './auth.js';
import crudRouter from './crudFactory.js';
import Account from '../models/Account.js';
import Category from '../models/Category.js';
import transactions from './transactions.js';
import transfers from './transfers.js';
import budgets from './budgets.js';
import dashboard from './dashboard.js';
import simulator from './simulator.js';
import admin from './admin.js';

// === THE API ROUTER: every URL of the app is declared here ===
const api = Router();
api.use('/auth', auth);                          // register, login, me
api.use('/accounts', crudRouter(Account, 'Account'));
api.use('/categories', crudRouter(Category, 'Category'));
api.use('/transactions', transactions);          // CRUD + CSV export
api.use('/transfers', transfers);                // ACID transfers
api.use('/budgets', budgets);                    // CRUD + alerts
api.use('/dashboard', dashboard);                // chart data
api.use('/simulator', simulator);                // loan / amortization
api.use('/admin', admin);                        // users + audit log (roles)
export default api;
