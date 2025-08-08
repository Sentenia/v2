export default async function handler(req,res){
  const { address } = req.query; const key=process.env.MORALIS_KEY;
  if(!address) return res.status(400).json({error:'missing_address'});
  if(!key) return res.status(500).json({error:'server_missing_key'});
  try{
    const url=`https://deep-index.moralis.io/api/v2.2/wallets/${address}/portfolio?chain=eth`;
    const r=await fetch(url,{headers:{'X-API-Key':key}}); if(!r.ok) throw new Error('Moralis '+r.status);
    const j=await r.json(); const tokens=(j?.tokens||[]).map(t=>({
      symbol:t.symbol, name:t.name, balance:Number(t.balance_formatted||t.balance||0), tokenAddress:t.token_address, decimals:t.decimals||18
    })); res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60'); return res.json({tokens});
  }catch(e){ return res.status(502).json({error:String(e)}) }
}