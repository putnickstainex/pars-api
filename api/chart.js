export default async function handler(req, res) {
  // Tüm originlere izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, interval, range } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol gerekli' });

  const tf = interval || '1wk';
  const r  = range || '2y';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${tf}&range=${r}&events=history`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com',
      },
    });
    if (!response.ok) return res.status(response.status).json({ error: `Yahoo hata: ${response.status}` });
    const data = await response.json();
    if (!data?.chart?.result?.[0]) return res.status(404).json({ error: 'Veri bulunamadı' });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
