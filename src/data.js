// Frontend calls your backend (no keys exposed)
export async function fetchEthTxs(address){ const r=await fetch(`/api/txs/eth?address=${address}`); return (await r.json()).rows||[] }
export async function fetchEthBalances(address){ const r=await fetch(`/api/balances/eth?address=${address}`); const j=await r.json(); return {tokens:j.tokens||[]} }
export async function fetchPulseTxs(address){ const r=await fetch(`/api/txs/pulse?address=${address}`); return (await r.json()).rows||[] }
export async function fetchPulseBalances(address){ const r=await fetch(`/api/balances/pulse?address=${address}`); const j=await r.json(); return {tokens:j.tokens||[]} }
export async function fetchPriceUsd(chain,tokenAddress){ if(!tokenAddress) return null; const r=await fetch(`/api/prices?chain=${chain}&token=${tokenAddress}`); const j=await r.json(); return j.priceUsd??null }
