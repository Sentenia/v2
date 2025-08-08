export default async function handler(req,res){
  const { address } = req.query; const key = process.env.MORALIS_KEY || process.env.ETHERSCAN_KEY;
  if(!address) return res.status(400).json({error:'missing_address'});
  if(!key) return res.status(500).json({error:'server_missing_key'});
  try{
    if(process.env.MORALIS_KEY){
      const url=`https://deep-index.moralis.io/api/v2.2/wallets/${address}/history?chain=eth&limit=25`;
      const r=await fetch(url,{headers:{'X-API-Key':process.env.MORALIS_KEY}}); if(!r.ok) throw new Error('Moralis '+r.status);
      const j=await r.json(); const rows=(j?.result||[]).map(tx=>({
        date:new Date(tx.block_timestamp||Date.now()).toISOString().slice(0,10), type: tx.value&&tx.value!=='0'?'Transfer':'Tx',
        asset:'ETH', amount:(Number(tx.value||0)/1e18).toFixed(6), usd:0, note:(tx.hash||'').slice(0,10)+'…'
      })); res.setHeader('Cache-Control','s-maxage=15, stale-while-revalidate=60'); return res.json({rows});
    } else {
      const url=`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${process.env.ETHERSCAN_KEY}`;
      const r=await fetch(url); const j=await r.json(); const rows=(j?.result||[]).slice(0,25).map(tx=>({
        date:new Date((tx.timeStamp||0)*1000).toISOString().slice(0,10), type:Number(tx.value)>0?'Transfer':'Tx', asset:'ETH',
        amount:(Number(tx.value||0)/1e18).toFixed(6), usd:0, note:(tx.hash||'').slice(0,10)+'…'
      })); res.setHeader('Cache-Control','s-maxage=15, stale-while-revalidate=60'); return res.json({rows});
    }
  }catch(e){ return res.status(502).json({error:String(e)}) }
}