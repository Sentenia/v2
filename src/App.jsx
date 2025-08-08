// src/App.jsx
import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import Taxes from './components/Taxes';

export default function App() {
  const [wallets, setWallets] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      let allTokens = [];
      for (const wallet of wallets) {
        const ethRes = await fetch(`/api/balances/eth?address=${wallet}`);
        const ethData = await ethRes.json();

        const pulseRes = await fetch(`/api/balances/pulse?address=${wallet}`);
        const pulseData = await pulseRes.json();

        const tokens = [...ethData, ...pulseData];
        for (const token of tokens) {
          const priceRes = await fetch(`/api/prices?symbol=${token.symbol}`);
          const priceData = await priceRes.json();
          token.price = priceData.price || 0;
          token.value = token.price * token.amount;
        }
        allTokens = [...allTokens, ...tokens];
      }

      // Sort by value
      allTokens.sort((a, b) => b.value - a.value);
      setPortfolio(allTokens);
      setTotalValue(allTokens.reduce((sum, t) => sum + t.value, 0));
    }

    if (wallets.length > 0) {
      fetchData();
    }
  }, [wallets]);

  return (
    <div>
      <Portfolio portfolio={portfolio} totalValue={totalValue} setWallets={setWallets} />
      <Taxes portfolio={portfolio} />
    </div>
  );
}
