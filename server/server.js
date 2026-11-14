import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import api from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.get('/', (req, res) => res.json({ app: 'TuniBudget API', status: 'ok' }));
app.use('/api', api);
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => app.listen(process.env.PORT || 5000, () => console.log('API on port', process.env.PORT || 5000)))
  .catch((e) => { console.error(e.message); process.exit(1); });
