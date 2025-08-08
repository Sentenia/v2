import React,{useState,useEffect,useMemo}from'react';
import Header from './Header.jsx'; import Portfolio from './Portfolio.jsx'; import WalletsPanel from './WalletsPanel.jsx'; import TxTable from './TxTable.jsx'; import Settings from './Settings.jsx';
import { fetchEthBalances, fetchEthTxs, fetchPulseBalances, fetchPulseTxs, fetchPriceUsd } from './data.js';
export default function App(){
  const [showAllChains,setShowAllChains]=useState(true); const [mainChain,setMainChain]=useState('pulse'); const [tab,setTab]=useState('portfolio');
  const [wallets,setWallets]=useState(()=>{ try{return JSON.parse(localStorage.getItem('tellawia.wallets')||'[]')}catch{return[]} });
  const [rows,setRows]=useState([]); const [portfolioRows,setPortfolioRows]=useState([]);
  useEffect(()=>{ localStorage.setItem('tellawia.wallets',JSON.stringify(wallets)) },[wallets]);
  useEffect(()=>{ (async()=>{
    const all=[]; for(const w of wallets){
      if(w.chain==='eth'){ const {tokens}=await fetchEthBalances(w.address); tokens.forEach(t=>all.push({...t,chain:'ethereum',wallet:w.address})) }
      else { const {tokens}=await fetchPulseBalances(w.address); tokens.forEach(t=>all.push({...t,chain:'pulsechain',wallet:w.address})) }
    }
    const withUsd=[]; for(const h of all){ let price=null;
      if(h.tokenAddress && h.tokenAddress!=='pls'){ price=await fetchPriceUsd(h.chain,h.tokenAddress) }
      else if((h.symbol||'').toUpperCase()==='PLS'){ price=price??0.005 }
      const usd=price?Number(h.balance||0)*Number(price):0; withUsd.push({...h,priceUsd:price||0,valueUsd:usd})
    }
    const map=new Map(); for(const r of withUsd){ const key=`${r.chain}:${r.tokenAddress||r.symbol}`; const prev=map.get(key)||{...r,balance:0,valueUsd:0}; prev.balance+=Number(r.balance)||0; prev.valueUsd+=Number(r.valueUsd)||0; map.set(key,prev) }
    setPortfolioRows(Array.from(map.values()).sort((a,b)=>b.valueUsd-a.valueUsd))
  })() },[wallets,showAllChains,mainChain]);
  useEffect(()=>{ (async()=>{
    let all=[]; for(const w of wallets){ if(w.chain==='eth'){ all=all.concat(await fetchEthTxs(w.address)) } else { all=all.concat(await fetchPulseTxs(w.address)) } }
    setRows(all)
  })() },[wallets]);
  const total=useMemo(()=>portfolioRows.reduce((a,b)=>a+(b.valueUsd||0),0),[portfolioRows]);
  return (<>
    <Header tab={tab} setTab={setTab} showAllChains={showAllChains} setShowAllChains={setShowAllChains} mainChain={mainChain} setMainChain={setMainChain}/>
    <div className="wrap">{tab==='portfolio'&&<Portfolio rows={portfolioRows} total={total}/>} {tab==='wallet'&&(<><WalletsPanel wallets={wallets} setWallets={setWallets}/><TxTable rows={rows}/></>)} {tab==='taxes'&&(<><div className="card p16"><div className="muted">Tax module uses historical pricing fallback.</div></div><TxTable rows={rows}/></>)} {tab==='settings'&&<Settings/>}</div>
    <footer><div className="wrap" style={{padding:'0 16px'}}>Tellawia — <span className="muted">Powered by Sentria</span></div></footer>
  </>);
}