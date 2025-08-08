// api/prices.js
export default async function handler(req, res) {
  const { symbol, date } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  try {
    // Try Dexscreener first
    const dexResp = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${symbol}`);
    if (dexResp.ok) {
      const dexData = await dexResp.json();
      if (dexData.pairs && dexData.pairs[0]?.priceUsd) {
        return res.status(200).json({ price: parseFloat(dexData.pairs[0].priceUsd) });
      }
    }

    // Fallback: CoinGecko
    let cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`;
    if (date) {
      cgUrl = `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/history?date=${date}`;
    }
    const cgResp = await fetch(cgUrl);
    const cgData = await cgResp.json();
    let price = cgData?.market_data?.current_price?.usd || cgData?.usd;
    res.status(200).json({ price: parseFloat(price) || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
