import { Router } from 'express';
import { db } from '../../database/memoryStore';
import { getConfig, updateConfig } from '../../config/chatbot.config';
import { LLMFactory } from '../../llm/llmFactory';

export const healthRouter = Router();
export const configRouter = Router();

/**
 * GET /health or /api/health
 */
healthRouter.get('/', (req, res) => {
  const stats = db.getStats();
  const config = getConfig();
  const activeProvider = LLMFactory.getProvider();

  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    databaseStats: stats,
    activeLLM: {
      provider: activeProvider.name,
      configuredProvider: config.llm.provider,
      model: config.llm.model,
      geminiAvailable: Boolean(process.env.GEMINI_API_KEY || config.llm.geminiApiKey)
    },
    searchSettings: {
      minConfidenceThreshold: config.search.minConfidenceThreshold,
      highConfidenceThreshold: config.search.highConfidenceThreshold,
      maxResults: config.search.maxResults
    }
  });
});

/**
 * GET /config or /api/config
 */
configRouter.get('/', (req, res) => {
  const config = getConfig();
  // Redact secrets
  const sanitized = {
    ...config,
    llm: {
      ...config.llm,
      geminiApiKey: config.llm.geminiApiKey ? '***REDACTED***' : undefined,
      openaiApiKey: config.llm.openaiApiKey ? '***REDACTED***' : undefined,
      groqApiKey: config.llm.groqApiKey ? '***REDACTED***' : undefined,
      openrouterApiKey: config.llm.openrouterApiKey ? '***REDACTED***' : undefined,
    }
  };
  return res.json({ success: true, data: sanitized });
});

/**
 * PUT /config or /api/config
 */
configRouter.put('/', (req, res) => {
  try {
    const updates = req.body;
    const newConfig = updateConfig(updates);
    return res.json({
      success: true,
      message: 'Configuration updated successfully',
      data: {
        ...newConfig,
        llm: {
          ...newConfig.llm,
          geminiApiKey: newConfig.llm.geminiApiKey ? '***REDACTED***' : undefined,
          openaiApiKey: newConfig.llm.openaiApiKey ? '***REDACTED***' : undefined
        }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
