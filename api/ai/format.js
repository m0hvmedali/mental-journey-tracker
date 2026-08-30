/* global process */
import { aiServerService } from './service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { rawText, instructions } = req.body || {};

    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    const formattedMarkdown = await aiServerService.formatMarkdown({ rawText, instructions });

    return res.status(200).json({ markdown: formattedMarkdown || rawText });
  } catch (error) {
    console.error('API Format Markdown Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
