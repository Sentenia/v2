import React from 'react';
export default function Header({tab,setTab,showAllChains,setShowAllChains,mainChain,setMainChain}){
  return (<header><div className="hinner">
    <div className="brand"><div className="logo">🤖</div><div><div className="title">Tellawia</div><div className="sub">Powered by Sentria</div></div></div>
    <div className="controls">
      <button className={'btn '+(tab==='portfolio'?'on':'')} onClick={()=>setTab('portfolio')}>Portfolio</button>
      <button className={'btn '+(tab==='wallet'?'on':'')} onClick={()=>setTab('wallet')}>Wallets</button>
      <button className={'btn '+(tab==='taxes'?'on':'')} onClick={()=>setTab('taxes')}>Taxes</button>
      <button className={'btn '+(tab==='settings'?'on':'')} onClick={()=>setTab('settings')}>Settings</button>
      <button className={'btn '+(showAllChains?'on':'')} onClick={()=>setShowAllChains(v=>!v)}>All Chains: {showAllChains?'On':'Off'}</button>
      <button className={'btn '+(mainChain==='pulse'?'on':'')} onClick={()=>setMainChain('pulse')}>PulseChain</button>
      <button className={'btn '+(mainChain==='eth'?'on':'')} onClick={()=>setMainChain('eth')}>Ethereum</button>
    </div></div></header>);
}