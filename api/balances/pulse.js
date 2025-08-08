export default async function handler(req, res) {
  const { address } = req.query;
  const base = process.env.PULSE_API_BASE || 'https://scan.pulsechain.com';
  if (!address) return res.status(400).json({ error: 'missing_address' });

  try {
    const acctRes = await fetch(`${base}/api/v2/addresses/${address}`);
    const acctJson = acctRes.ok ? await acctRes.json() : null;
    const native = acctJson?.coin_balance ? Number(acctJson.coin_balance)/1e18 : 0;

    const tbRes = await fetch(`${base}/api/v2/addresses/${address}/token-balances`);
    const tbJson = tbRes.ok ? await tbRes.json() : { items: [] };
    const items = tbJson.items || tbJson.results || [];

    const tokens = [
      { symbol: 'PLS', name: 'Pulse', balance: native, tokenAddress: 'pls-native', decimals: 18 },
      ...items.map(t => {
        const dec = t.token?.decimals ?? 18;
        const raw = t.value ?? t.balance ?? '0';
        return {
          symbol: t.token?.symbol || 'PRC20',
          name: t.token?.name || 'Token',
          balance: Number(raw) / Math.pow(10, dec),
          tokenAddress: t.token?.address || '',
          decimals: dec,
        };
      })
    ];

    res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60');
    return res.json({ tokens });
  } catch (e) {
    return res.status(502).json({ error: String(e) });
  }
}
