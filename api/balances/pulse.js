// api/balances/pulse.js
export default async function handler(req, res) {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Missing address' });

  try {
    const resp = await fetch(
      `https://scan.pulsechain.com/api?module=account&action=tokentx&address=${address}`
    );
    const data = await resp.json();

    // Aggregate token balances
    const balances = {};
    data.result.forEach(tx => {
      const token = tx.tokenSymbol || 'UNKNOWN';
      const value = parseFloat(tx.value) / 10 ** tx.tokenDecimal;
      if (!balances[token]) balances[token] = 0;
      if (tx.to.toLowerCase() === address.toLowerCase()) {
        balances[token] += value;
      } else {
        balances[token] -= value;
      }
    });

    res.status(200).json(
      Object.entries(balances).map(([symbol, amount]) => ({
        symbol,
        amount,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
