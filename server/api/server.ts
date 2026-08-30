import express from 'express';
import cors from 'cors';
import path from 'path';
import { chatRouter } from './routes/chatRoutes';
import { knowledgeRouter } from './routes/knowledgeRoutes';
import { searchRouter } from './routes/searchRoutes';
import { conversationRouter } from './routes/conversationRoutes';
import { tasksRouter } from './routes/tasksRoutes';
import { healthRouter, configRouter } from './routes/healthRoutes';
import { debugRouter } from './routes/debugRoutes';
import cmsRouter from './routes/cmsRoutes';
import { seedDefaultKnowledge } from '../knowledge/defaultKnowledge';
import { db } from '../database/memoryStore';

export async function createApp() {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Seed default knowledge base if empty
  if (db.getAllEntities().length === 0) {
    console.log('🌱 Initializing & Seeding default knowledge base...');
    seedDefaultKnowledge();
    console.log(`✅ Seeded ${db.getAllEntities().length} entities, ${db.getAllDocuments().length} documents, and ${db.getAllFacts().length} facts.`);
  }

  // --- MOUNT API ROUTES ---
  // Mount on /api/*
  app.use('/api/chat', chatRouter);
  app.use('/api/knowledge', knowledgeRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/conversations', conversationRouter);
  app.use('/api/tasks', tasksRouter);
  app.use('/api/health', healthRouter);
  app.use('/api/config', configRouter);
  app.use('/api/debug/llm', debugRouter);
  app.use('/api/cms', cmsRouter);

  // Also mount on root paths for direct compatibility
  app.use('/chat', chatRouter);
  app.use('/knowledge', knowledgeRouter);
  app.use('/search', searchRouter);
  app.use('/conversations', conversationRouter);
  app.use('/health', healthRouter);
  app.use('/config', configRouter);
  app.use('/debug/llm', debugRouter);

  // Audit logs endpoint
  app.get('/api/audit-logs', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    return res.json({ success: true, data: db.getAuditLogs(limit) });
  });
  app.get('/audit-logs', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    return res.json({ success: true, data: db.getAuditLogs(limit) });
  });

  return app;
}

export async function startServer() {
  const app = await createApp();
  const PORT = 3000;

  // Vite development middleware vs production static file serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Hybrid Chatbot Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Endpoints available: /chat, /knowledge, /search, /conversations, /health`);
  });
}
