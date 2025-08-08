export default async function handler(req, res) {
  const { chain='ethereum', token, timestamp } = req.query;
  if (!token) return res.status(400).json({ error: 'missing_token' });

  // Native helpers
  const isEthNative = token === 'eth-native';
  const isPlsNative = token === 'pls-native';

  // 1) Native (live) via CG simple/price
  if (isEthNative || isPlsNative) {
    try {
      const id = isEthNative ? 'ethereum' : 'pulsechain';
      const cg = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
      if (cg.ok) {
        const j = await cg.json();
        const priceUsd = j?.[id]?.usd;
        if (priceUsd) return res.json({ priceUsd: Number(priceUsd), source: 'coingecko' });
      }
    } catch(e){}
    return res.status(502).json({ error: 'price_unavailable' });
  }

  // 2) ERC-20 live via Dexscreener
  try {
    const ds = await fetch(`https://api.dexscreener.com/token-pairs/v1/${chain}/${token}`);
    if (ds.ok) {
      const j = await ds.json();
      const best = j?.pairs?.[0];
      if (best?.priceUsd) {
        res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60');
        return res.json({ priceUsd: Number(best.priceUsd), source: 'dexscreener', pair: best.pairAddress || null });
      }
    }
  } catch(e){}

  // 3) Historical (taxes) via CoinGecko by date if we got a timestamp
  if (timestamp) {
    try {
      const t = new Date(Number(timestamp)*1000);
      const dd = String(t.getUTCDate()).padStart(2,'0');
      const mm = String(t.getUTCMonth()+1).padStart(2,'0');
      const yyyy = t.getUTCFullYear();
      const platform = chain === 'ethereum' ? 'ethereum' : chain;
      const url = `https://api.coingecko.com/api/v3/coins/${platform}/contract/${token}/history?date=${dd}-${mm}-${yyyy}`;
      const cg = await fetch(url);
      if (cg.ok) {
        const data = await cg.json();
        const price = data?.market_data?.current_price?.usd;
        if (price) {
          res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=86400');
          return res.json({ priceUsd: Number(price), source: 'coingecko' });
        }
      }
    } catch(e){}
  }

  return res.status(502).json({ error: 'price_unavailable' });
}
