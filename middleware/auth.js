// middleware/auth.js
const apiKeyHeader = 'x-api-key';

module.exports = (req, res, next) => {
  const apiKey = req.headers[apiKeyHeader];
  const expected = process.env.API_KEY || 'super-secret-api-key'; // fallback if not set
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  if (apiKey !== expected) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  // optionally set req.user or req.client
  next();
};
