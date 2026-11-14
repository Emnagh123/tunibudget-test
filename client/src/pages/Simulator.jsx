import { useState, useEffect } from 'react';

export default function Simulator() {
  const [principal, setPrincipal] = useState(20000);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(60);
  const [result, setResult] = useState(null);

  // Recompute every time an input changes (same formula as the API)
  useEffect(() => {
    const i = rate / 100 / 12;
    const payment = i === 0 ? principal / months : (principal * i) / (1 - Math.pow(1 + i, -months));
    let balance = principal; const table = [];
    for (let n = 1; n <= months; n++) {
      const interest = balance * i, capital = payment - interest;
      balance = Math.max(balance - capital, 0);
      table.push({ n, payment, interest, capital, balance });
    }
    setResult({ payment, totalInterest: payment * months - principal, table });
  }, [principal, rate, months]);

  return (
    <>
      <h1>Loan Simulator</h1>
      <div className="card row">
        <label>Amount (TND)<input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value)} /></label>
        <label>Annual rate (%)<input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
        <label>Duration (months)<input type="number" value={months} onChange={(e) => setMonths(+e.target.value)} /></label>
      </div>
      {result && <>
        <div className="grid">
          <div className="card stat"><small>Monthly payment</small><h2>{result.payment.toFixed(3)} TND</h2></div>
          <div className="card stat"><small>Total interest</small><h2>{result.totalInterest.toFixed(3)} TND</h2></div>
        </div>
        <div className="card scroll"><table>
          <thead><tr><th>#</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Remaining</th></tr></thead>
          <tbody>{result.table.map((r) => (
            <tr key={r.n}><td>{r.n}</td><td>{r.payment.toFixed(3)}</td><td>{r.interest.toFixed(3)}</td><td>{r.capital.toFixed(3)}</td><td>{r.balance.toFixed(3)}</td></tr>))}
          </tbody></table></div></>}
    </>
  );
}
