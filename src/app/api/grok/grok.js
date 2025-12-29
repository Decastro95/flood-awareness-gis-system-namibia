// Server-side proxy for Grok (or the X.ai API).
// Keeps GROK_API_KEY secret (do NOT set NEXT_PUBLIC_ for this).
// Example: POST /api/grok  { "query": "Is flooding likely in Oshana?" }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) return res.status(500).json({ error: 'Server misconfiguration: missing GROK_API_KEY' });

  try {
    // Replace the URL below with the official endpoint and payload format for Grok/X.ai.
    // The current URL is a placeholder and should be updated to the correct vendor endpoint.
    const resp = await fetch('https://api.x.ai/grok/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const text = await resp.text();
    if (!resp.ok) {
      // Return vendor response text for debugging (avoid leaking sensitive data).
      return res.status(resp.status).json({ error: 'Grok API error', details: text });
    }

    // If JSON, parse; otherwise return raw text
    try {
      const data = JSON.parse(text);
      const grokResponse = data.response ?? data.result ?? data;
      return res.status(200).json({ response: grokResponse });
    } catch {
      return res.status(200).json({ response: text });
    }
  } catch (err) {
    console.error('Grok proxy error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
