import { Router } from 'express';
import { searchEngine } from '../../search/searchEngine';

export const searchRouter = Router();

/**
 * POST /search or /api/search
 * Inspect search engine retrieval, ranking, and strategy scores directly without LLM
 */
searchRouter.post('/', async (req, res) => {
  try {
    const { query, limit, contextEntityIds, detectedEntities } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    const output = await searchEngine.search(query, {
      limit: limit || 5,
      contextEntityIds: contextEntityIds || [],
      detectedEntities: detectedEntities || []
    });

    return res.json({
      success: true,
      data: output
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
