export default async function handler(req,res){
  const { address } = req.query; const base=process.env.PULSE_API_BASE||'https://scan.pulsechain.com';
  if(!address) return res.status(400).json({error:'missing_address'});
  try{
    const acct=await fetch(`${base}/api/v2/addresses/${address}`); const aj=acct.ok?await acct.json():null; const native=aj?.coin_balance?Number(aj.coin_balance)/1e18:0;
    const tb=await fetch(`${base}/api/v2/addresses/${address}/token-balances`); const tj=tb.ok?await tb.json():{items:[]}; const items=tj.items||tj.results||[];
    const tokens=[{symbol:'PLS',name:'Pulse',balance:native,tokenAddress:'pls',decimals:18},
      ...items.map(t=>({
        symbol:t.token?.symbol||'PRC20', name:t.token?.name||'Token',
        balance:Number(t.value||t.balance||0)/Math.pow(10,t.token?.decimals||18),
        tokenAddress:t.token?.address, decimals:t.token?.decimals||18
      }))];
    res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60'); return res.json({tokens});
  }catch(e){ return res.status(502).json({error:String(e)}) }
}