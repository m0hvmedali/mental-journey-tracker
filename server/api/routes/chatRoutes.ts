import { Router } from 'express';
import { HybridChatbotEngine } from '../../core/hybridEngine';

export const chatRouter = Router();

/**
 * POST /chat or /api/chat
 * Primary chat endpoint
 */
chatRouter.post('/', async (req, res) => {
  try {
    const { message, query, conversationId, userId, provider, temperature, maxTokens } = req.body;
    const userMessage = message || query;

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message or query string is required'
      });
    }

    const output = await HybridChatbotEngine.processMessage(userMessage, {
      conversationId,
      userId,
      providerOverride: provider,
      temperature,
      maxTokens
    });

    return res.json({
      success: true,
      data: output
    });
  } catch (error: any) {
    console.error('Error in /chat endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
});
