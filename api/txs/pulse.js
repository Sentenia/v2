export default async function handler(req,res){
  const { address, page='1', limit='25' } = req.query; const base=process.env.PULSE_API_BASE||'https://scan.pulsechain.com';
  if(!address) return res.status(400).json({error:'missing_address'});
  try{
    const url=`${base}/api/v2/addresses/${address}/transactions?limit=${limit}&page=${page}`;
    const r=await fetch(url); if(!r.ok) throw new Error('Pulse API '+r.status);
    const j=await r.json(); const list=Array.isArray(j?.items)?j.items:(j?.results||j||[]);
    const rows=list.slice(0,Number(limit)).map(tx=>({
      date:new Date((tx.timestamp?tx.timestamp*1000:Date.now())).toISOString().slice(0,10),
      type: tx.value&&tx.value!=='0'?'Transfer':'Tx', asset:'PLS', amount:(Number(tx.value||0)/1e18).toFixed(6), usd:0, note:(tx.hash||tx.tx_hash||'').slice(0,10)+'…'
    })); res.setHeader('Cache-Control','s-maxage=15, stale-while-revalidate=60'); return res.json({rows});
  }catch(e){ return res.status(502).json({error:String(e)}) }
}