export default async function handler(req, res) {
  const { address } = req.query;
  const key = process.env.MORALIS_KEY;
  if (!address) return res.status(400).json({ error: 'missing_address' });
  if (!key) return res.status(500).json({ error: 'server_missing_key' });

  try {
    // 1) Native ETH balance
    const balUrl = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/balance?chain=eth`;
    const balRes = await fetch(balUrl, { headers: { 'X-API-Key': key }});
    if (!balRes.ok) throw new Error(`Moralis balance ${balRes.status}`);
    const bal = await balRes.json();
    const native = (Number(bal.balance) || 0) / 1e18;

    // 2) ERC-20 balances (explicit endpoint is more stable than portfolio)
    const ercUrl = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=eth`;
    const ercRes = await fetch(ercUrl, { headers: { 'X-API-Key': key }});
    if (!ercRes.ok) throw new Error(`Moralis tokens ${ercRes.status}`);
    const erc = await ercRes.json();

    const tokens = [
      { symbol: 'ETH', name: 'Ether', balance: native, tokenAddress: 'eth-native', decimals: 18 },
      ...(erc?.result || []).map(t => ({
        symbol: t.symbol,
        name: t.name,
        balance: Number(t.balance || 0) / Math.pow(10, t.decimals || 18),
        tokenAddress: t.token_address,
        decimals: t.decimals || 18,
      }))
    ];

    res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60');
    return res.json({ tokens });
  } catch (e) {
    return res.status(502).json({ error: String(e) });
  }
}
