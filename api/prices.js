export default async function handler(req,res){
  const { chain='ethereum', token, timestamp } = req.query;
  if(!token) return res.status(400).json({error:'missing_token'});
  try{ // Dexscreener live price
    const ds = await fetch(`https://api.dexscreener.com/token-pairs/v1/${chain}/${token}`);
    if(ds.ok){ const j=await ds.json(); const best=j?.pairs?.[0]; if(best?.priceUsd){ res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60'); return res.json({priceUsd:Number(best.priceUsd), source:'dexscreener', pair:best.pairAddress||null}); } }
  }catch(e){}
  if(timestamp){ // CoinGecko historical by date
    try{
      const t=new Date(Number(timestamp)*1000), dd=String(t.getUTCDate()).padStart(2,'0'), mm=String(t.getUTCMonth()+1).padStart(2,'0'), yyyy=t.getUTCFullYear();
      const platform = chain==='ethereum' ? 'ethereum' : chain;
      const url=`https://api.coingecko.com/api/v3/coins/${platform}/contract/${token}/history?date=${dd}-${mm}-${yyyy}`;
      const cg=await fetch(url); if(cg.ok){ const d=await cg.json(); const p=d?.market_data?.current_price?.usd; if(p){ res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=86400'); return res.json({priceUsd:Number(p), source:'coingecko'}) } }
    }catch(e){}
  }
  return res.status(502).json({error:'price_unavailable'});
}