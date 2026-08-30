import { Router } from 'express';
import { db } from '../../database/memoryStore';
import { KnowledgeParser } from '../../knowledge/parser';
import { PAGES_CORPUS } from '../../knowledge/pagesKnowledge';

export const knowledgeRouter = Router();

/**
 * GET /knowledge
 * Retrieve summary or full list of knowledge items
 */
knowledgeRouter.get('/', (req, res) => {
  try {
    const { category, type } = req.query;
    const entities = db.getAllEntities();
    const documents = db.getAllDocuments();
    const facts = db.getAllFacts();
    const stats = db.getStats();

    return res.json({
      success: true,
      stats,
      data: {
        entities: entities.map(e => ({
          ...e,
          attributes: db.getAttributesForEntity(e.id),
          relationships: db.getRelationshipsForEntity(e.id)
        })),
        documents,
        facts
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /knowledge
 * Add a single entity or document or structured item
 */
knowledgeRouter.post('/', (req, res) => {
  try {
    const payload = req.body;
    const result = KnowledgeParser.ingestJSON(payload);

    if (!result.success && result.errors.length > 0) {
      return res.status(400).json({ success: false, errors: result.errors });
    }

    return res.status(201).json({
      success: true,
      message: 'Knowledge ingested successfully',
      result
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /knowledge/import
 * Import raw JSON, CSV, or plain text
 */
knowledgeRouter.post('/import', (req, res) => {
  try {
    const { format, content, title, category } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'Content is required for import' });
    }

    let result;
    if (format === 'csv') {
      result = KnowledgeParser.ingestCSV(content);
    } else if (format === 'text' || format === 'markdown') {
      result = KnowledgeParser.ingestText(title || 'Imported Document', content, category);
    } else {
      // Default to JSON
      result = KnowledgeParser.ingestJSON(content);
    }

    return res.json({
      success: result.success,
      result
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /knowledge/:id
 * Delete entity or document by ID
 */
knowledgeRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntity = db.deleteEntity(id);
    const deletedDoc = db.deleteDocument(id);

    if (deletedEntity || deletedDoc) {
      return res.json({ success: true, message: `Item ${id} deleted successfully` });
    }

    return res.status(404).json({ success: false, error: 'Item not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /knowledge/pages
 * Get all indexed website pages with their summaries and links
 */
knowledgeRouter.get('/pages', (req, res) => {
  try {
    return res.json({
      success: true,
      data: PAGES_CORPUS
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /knowledge/pages/summarize
 * Summarize a specific page by its path or id
 */
knowledgeRouter.get('/pages/summarize', (req, res) => {
  try {
    const { path, id } = req.query;

    if (!path && !id) {
      return res.status(400).json({ success: false, error: 'Path or ID is required' });
    }

    const page = PAGES_CORPUS.find((p: any) => 
      (id && p.id === id) || 
      (path && (p.link === path || p.link.split('?')[0] === path.toString().split('?')[0] || p.link.endsWith(String(path))))
    );

    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }

    return res.json({
      success: true,
      data: {
        id: page.id,
        title: page.title,
        link: page.link,
        summary: page.summary,
        description: page.description
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

