# TuniBudget
Smart personal finance & mini-banking app (React + Express + MongoDB).

## Run the API
cd server && cp .env.example .env   # fill MONGO_URI (Atlas recommended: transactions need a replica set)
npm install && npm run seed && npm run dev

## Run the frontend (mock data, no API needed)
cd client && npm install && npm run dev
Test logins (password Test1234): user@tunibudget.tn, auditor@tunibudget.tn, admin@tunibudget.tn
