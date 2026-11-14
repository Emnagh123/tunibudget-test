import { Router } from 'express';
const r = Router();
// POST /api/simulator/loan { principal, annualRate (%), months }
r.post('/loan', (req, res) => {
  const { principal, annualRate, months } = req.body;
  if (!(principal > 0) || !(months > 0) || annualRate < 0) return res.status(400).json({ message: 'Invalid input' });
  const i = annualRate / 100 / 12;
  const payment = i === 0 ? principal / months : (principal * i) / (1 - Math.pow(1 + i, -months));
  let balance = principal; const table = [];
  for (let n = 1; n <= months; n++) {
    const interest = balance * i, capital = payment - interest;
    balance = Math.max(balance - capital, 0);
    table.push({ n, payment: +payment.toFixed(3), interest: +interest.toFixed(3), capital: +capital.toFixed(3), balance: +balance.toFixed(3) });
  }
  res.json({ monthlyPayment: +payment.toFixed(3), totalInterest: +(payment * months - principal).toFixed(3), table });
});
export default r;
