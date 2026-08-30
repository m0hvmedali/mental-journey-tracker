import { supabase, isSupabaseConfigured } from '@/supabaseClient';
import { authService } from './authService';

const LOCAL_STORAGE_KEY_PREFIX = '__ai_conversations_';
const LOCAL_MESSAGES_KEY_PREFIX = '__ai_messages_';

function getLocalConversations(userId) {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalConversations(userId, convs) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(convs));
  } catch (err) {
    console.warn('Failed to save local conversations:', err);
  }
}

function getLocalMessages(convId) {
  try {
    const raw = localStorage.getItem(`${LOCAL_MESSAGES_KEY_PREFIX}${convId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(convId, msgs) {
  try {
    localStorage.setItem(`${LOCAL_MESSAGES_KEY_PREFIX}${convId}`, JSON.stringify(msgs));
  } catch (err) {
    console.warn('Failed to save local messages:', err);
  }
}

export const conversationService = {
  /**
   * Get the current user ID securely or fallback to guest identifier.
   */
  async getUserId() {
    try {
      const user = await authService.getCurrentUser();
      if (user?.id) return user.id;
    } catch {
      // ignore
    }
    let guestId = localStorage.getItem('__guest_user_id__');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('__guest_user_id__', guestId);
    }
    return guestId;
  },

  /**
   * List all conversations for the current user
   */
  async getConversations() {
    const userId = await this.getUserId();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch conversations error, using local fallback:', err);
      }
    }

    return getLocalConversations(userId);
  },

  /**
   * Create a new conversation
   */
  async createConversation(title = 'محادثة جديدة') {
    const userId = await this.getUserId();
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const newConv = {
      id: conversationId,
      user_id: userId,
      title,
      messageCount: 0,
      state: {},
      created_at: now,
      updated_at: now
    };

    // Save locally first
    const existing = getLocalConversations(userId);
    saveLocalConversations(userId, [newConv, ...existing]);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert([newConv])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase create conversation error:', err);
      }
    }

    return newConv;
  },

  /**
   * Get a conversation and its messages
   */
  async getConversationDetails(conversationId) {
    const userId = await this.getUserId();

    if (isSupabaseConfigured) {
      try {
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single();

        if (!convError && conversation) {
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('timestamp', { ascending: true });

          return {
            conversation,
            messages: Array.isArray(messages) ? messages : []
          };
        }
      } catch (err) {
        console.warn('Supabase getConversationDetails error:', err);
      }
    }

    const localList = getLocalConversations(userId);
    const localConv = localList.find(c => c.id === conversationId) || {
      id: conversationId,
      title: 'محادثة جديدة',
      created_at: new Date().toISOString()
    };
    const localMsgs = getLocalMessages(conversationId);

    return {
      conversation: localConv,
      messages: localMsgs
    };
  },

  /**
   * Save a message into local storage and database
   */
  async saveMessage(conversationId, message) {
    const userId = await this.getUserId();
    const msgs = getLocalMessages(conversationId);
    msgs.push(message);
    saveLocalMessages(conversationId, msgs);

    // Update conversation message count & timestamp
    const convs = getLocalConversations(userId);
    const updatedConvs = convs.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messageCount: msgs.length,
          updated_at: new Date().toISOString()
        };
      }
      return c;
    });
    saveLocalConversations(userId, updatedConvs);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('messages').insert([{
          id: message.id,
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp || Date.now()
        }]);
      } catch {
        // ignore
      }
    }
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId) {
    const userId = await this.getUserId();
    const localList = getLocalConversations(userId).filter(c => c.id !== conversationId);
    saveLocalConversations(userId, localList);

    try {
      localStorage.removeItem(`${LOCAL_MESSAGES_KEY_PREFIX}${conversationId}`);
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('conversations')
          .delete()
          .eq('id', conversationId);
      } catch {
        // ignore
      }
    }

    return true;
  }
};

