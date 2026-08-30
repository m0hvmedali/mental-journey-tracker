import { Router } from 'express';
import { SupabaseStore } from '../../database/supabaseStore';
import { contextManager } from '../../context/contextManager';

export const conversationRouter = Router();

/**
 * GET /conversations or /api/conversations
 * List all conversations for a user
 */
conversationRouter.get('/', async (req, res) => {
  try {
    const userId = (req.query.userId as string) || 'guest';
    const conversations = await SupabaseStore.getUserConversations(userId);
    return res.json({
      success: true,
      data: conversations
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /conversations or /api/conversations
 * Create a new conversation
 */
conversationRouter.post('/', async (req, res) => {
  try {
    const { userId, title } = req.body;
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    const conv = await SupabaseStore.saveConversation(conversationId, {
      id: conversationId,
      user_id: userId || 'guest',
      title: title || 'محادثة جديدة',
      messageCount: 0,
      activeEntityIds: [],
      previousEntityIds: [],
      state: {}
    });

    return res.json({
      success: true,
      data: conv
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /conversations/:id
 * Retrieve conversation details, turns, context state, and messages
 */
conversationRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const synced = await SupabaseStore.syncConversationAndMessages(id);

    if (!synced) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const contextState = contextManager.getOrCreateState(id);

    return res.json({
      success: true,
      data: {
        conversation: synced.conversation,
        messages: synced.messages,
        contextState
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /conversations/:id
 * Delete a conversation
 */
conversationRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SupabaseStore.deleteConversation(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Conversation not found or could not be deleted' });
    }

    return res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

