import React from 'react';
export default function Settings(){
  return (<div className="card p16"><h2>Settings</h2>
    <p className="muted">Serverless APIs are used by default. No user keys required.</p>
    <p className="muted">ETH uses Moralis; Pulse uses Blockscout API; prices via Dexscreener with CoinGecko fallback for historical.</p>
  </div>);
}