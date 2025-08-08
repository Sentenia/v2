import React from 'react';
export default function Portfolio({rows,total}){
  return (<div className="card">
    <div className="row"><strong>Portfolio</strong><div className="muted">Total: ${total.toLocaleString()}</div></div>
    <div style={{padding:'8px 12px'}} className="muted">Sorted by USD value (desc)</div>
    <div style={{overflowX:'auto'}}><table><thead><tr>
      <th>Token</th><th>Name</th><th className="right">Balance</th><th className="right">Price</th><th className="right">Value (USD)</th><th className="right">% of Portfolio</th>
    </tr></thead><tbody>
      {rows.length===0 && <tr><td colSpan="6" style={{padding:'16px',opacity:.7,textAlign:'center'}}>No holdings yet. Add wallets on the Wallets tab.</td></tr>}
      {rows.map((r,i)=>{ const pct=total>0?(r.valueUsd/total*100):0; return (<tr key={i}>
        <td><span className="tokenLogo">◎</span>{r.symbol||'-'}</td>
        <td>{r.name||'-'}</td>
        <td className="right">{(r.balance||0).toLocaleString(undefined,{maximumFractionDigits:6})}</td>
        <td className="right">{r.priceUsd?`$${Number(r.priceUsd).toLocaleString()}`:'—'}</td>
        <td className="right">${(r.valueUsd||0).toLocaleString()}</td>
        <td className="right">{pct.toFixed(2)}%</td>
      </tr>)})}
    </tbody></table></div></div>);
}