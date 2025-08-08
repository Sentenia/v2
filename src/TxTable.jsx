import React from 'react';
export default function TxTable({rows}){
  return (<div className="card"><div className="row"><strong>Recent Transactions</strong><span className="muted">{rows.length} items</span></div>
  <div style={{overflowX:'auto'}}><table><thead><tr><th>Date</th><th>Type</th><th>Asset</th><th>Amount</th><th>USD</th><th>Notes</th></tr></thead>
  <tbody>{rows.length===0 && <tr><td colSpan="6" style={{padding:'16px',opacity:.7,textAlign:'center'}}>No transactions yet.</td></tr>}
  {rows.map((r,i)=>(<tr key={i}><td>{r.date}</td><td>{r.type}</td><td>{r.asset}</td><td>{r.amount}</td><td>${(r.usd||0).toLocaleString()}</td><td>{r.note||''}</td></tr>))}</tbody></table></div></div>);
}