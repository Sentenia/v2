import React,{useState}from'react';
export default function WalletsPanel({wallets,setWallets}){
  const [address,setAddress]=useState(''); const [label,setLabel]=useState(''); const [chain,setChain]=useState('pulse');
  const add=()=>{ if(!address) return alert('Enter a wallet address'); setWallets(prev=>[...prev,{address,label:label||'My Wallet',chain}]); setAddress(''); setLabel('') };
  const remove=i=>setWallets(prev=>prev.filter((_,idx)=>idx!==i));
  return (<div className="card p16" style={{marginBottom:16}}>
    <div className="row" style={{justifyContent:'flex-start',gap:12}}>
      <input className="input" placeholder="0x... wallet address" value={address} onChange={e=>setAddress(e.target.value)} style={{flex:3}}/>
      <input className="input" placeholder="Label (optional)" value={label} onChange={e=>setLabel(e.target.value)} style={{flex:2}}/>
      <select className="input" value={chain} onChange={e=>setChain(e.target.value)} style={{flex:1}}>
        <option value="pulse">PulseChain</option><option value="eth">Ethereum</option>
      </select>
      <button className="btn" onClick={add}>+ Add Wallet</button>
    </div>
    {wallets.length>0 ? <div style={{marginTop:12}}>{wallets.map((w,i)=>(<div key={i} className="row">
      <div style={{display:'flex',gap:8,alignItems:'center'}}><span className="pill">{w.chain==='pulse'?'PulseChain':'Ethereum'}</span><strong>{w.label}</strong></div>
      <code style={{opacity:.85}}>{w.address}</code><button className="btn" onClick={()=>remove(i)}>Remove</button>
    </div>))}</div> : <div className="muted" style={{marginTop:8}}>Add one or more wallet addresses to begin.</div>}
  </div>);
}