// npm run seed  -> creates one admin, one auditor, one user (password: Test1234)
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
await connectDB();
const password = await bcrypt.hash('Test1234', 10);
for (const [name, email, role] of [['Admin', 'admin@tunibudget.tn', 'admin'], ['Auditor', 'auditor@tunibudget.tn', 'auditor'], ['Emna', 'user@tunibudget.tn', 'user']])
  await User.updateOne({ email }, { name, email, role, password }, { upsert: true });
console.log('Seeded'); process.exit(0);
