// api/balances/eth.js
export default async function handler(req, res) {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Missing address' });

  try {
    const resp = await fetch(
      `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=eth`,
      {
        headers: {
          'X-API-Key': process.env.MORALIS_KEY,
        },
      }
    );
    const data = await resp.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
