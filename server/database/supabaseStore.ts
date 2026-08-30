import { supabase, isSupabaseConfigured } from './supabaseClient';
import { db } from './memoryStore';
import { ConversationRecord, MessageRecord } from './types';

export class SupabaseStore {
  /**
   * Fetch all conversations for a specific user
   */
  public static async getUserConversations(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback to memory
      const all = Array.from((db as any).conversations.values()) as any[];
      return all
        .filter(c => c.user_id === userId || !c.user_id)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user conversations from Supabase:', error);
        throw error;
      }

      return (data || []).map(c => ({
        id: c.id,
        user_id: c.user_id,
        title: c.title,
        createdAt: c.created_at ? new Date(c.created_at).getTime() : Date.now(),
        updatedAt: c.updated_at ? new Date(c.updated_at).getTime() : Date.now(),
        activeEntityIds: c.context?.activeEntityIds || [],
        previousEntityIds: c.context?.previousEntityIds || [],
        state: c.context?.state || {},
        messageCount: c.context?.messageCount || 0
      }));
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to memory:', err);
      const all = Array.from((db as any).conversations.values()) as any[];
      return all
        .filter(c => c.user_id === userId || !c.user_id)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    }
  }

  /**
   * Fetch a single conversation and populate it + messages in MemoryStore
   */
  public static async syncConversationAndMessages(conversationId: string): Promise<{ conversation: ConversationRecord; messages: MessageRecord[] } | null> {
    if (!isSupabaseConfigured || !supabase) {
      const conv = db.getConversation(conversationId);
      if (!conv) return null;
      const msgs = db.getMessages(conversationId);
      return { conversation: conv, messages: msgs };
    }

    try {
      // 1. Fetch conversation
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError || !convData) {
        if (convError && convError.code !== 'PGRST116') {
          console.error('Error fetching conversation from Supabase:', convError);
        }
        return null;
      }

      // 2. Fetch messages
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Error fetching messages from Supabase:', msgError);
        throw msgError;
      }

      // Map Supabase fields to internal records
      const activeEntityIds = convData.context?.activeEntityIds || [];
      const previousEntityIds = convData.context?.previousEntityIds || [];
      const state = convData.context?.state || {};

      const conversation: ConversationRecord = {
        id: convData.id,
        user_id: convData.user_id,
        title: convData.title,
        createdAt: convData.created_at ? new Date(convData.created_at).getTime() : Date.now(),
        updatedAt: convData.updated_at ? new Date(convData.updated_at).getTime() : Date.now(),
        activeEntityIds,
        previousEntityIds,
        state,
        messageCount: messagesData?.length || 0
      };

      const messages: MessageRecord[] = (messagesData || []).map(m => ({
        id: m.id,
        conversationId: m.conversation_id,
        role: m.role,
        content: m.content,
        timestamp: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
        metadata: m.metadata || {}
      }));

      // Cache / Sync in MemoryStore for this request
      (db as any).conversations.set(conversationId, conversation);
      (db as any).messages.set(conversationId, messages);

      return { conversation, messages };
    } catch (err) {
      console.warn('Supabase sync failed, falling back to memory:', err);
      const conv = db.getConversation(conversationId);
      if (!conv) return null;
      const msgs = db.getMessages(conversationId);
      return { conversation: conv, messages: msgs };
    }
  }

  /**
   * Save or update conversation in Supabase + memory
   */
  public static async saveConversation(conversationId: string, updates: Partial<ConversationRecord> & { user_id?: string; title?: string }): Promise<ConversationRecord> {
    const memoryConv = db.getOrCreateConversation(conversationId);
    
    // Apply updates locally
    const merged: ConversationRecord = {
      ...memoryConv,
      ...updates,
      updatedAt: Date.now()
    } as any;
    
    (db as any).conversations.set(conversationId, merged);

    if (!isSupabaseConfigured || !supabase) {
      return merged;
    }

    try {
      const payload = {
        id: conversationId,
        user_id: merged.user_id || updates.user_id || null,
        title: merged.title || updates.title || 'محادثة جديدة',
        context: {
          activeEntityIds: merged.activeEntityIds,
          previousEntityIds: merged.previousEntityIds,
          state: merged.state,
          messageCount: merged.messageCount
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('conversations')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Error saving conversation to Supabase:', error);
        throw error;
      }
    } catch (err) {
      console.warn('Supabase upsert failed, stored in memory:', err);
    }

    return merged;
  }

  /**
   * Save a single message to Supabase + memory
   */
  public static async saveMessage(msg: MessageRecord): Promise<void> {
    // 1. Add locally
    const existing = (db as any).messages.get(msg.conversationId) || [];
    if (!existing.some((m: any) => m.id === msg.id)) {
      existing.push(msg);
      (db as any).messages.set(msg.conversationId, existing);
    }

    // Update message count on conversation
    const conv = db.getConversation(msg.conversationId);
    if (conv) {
      conv.messageCount = existing.length;
      await this.saveConversation(msg.conversationId, { messageCount: existing.length });
    }

    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    try {
      const payload = {
        id: msg.id,
        conversation_id: msg.conversationId,
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata || {},
        created_at: new Date(msg.timestamp).toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert([payload]);

      if (error) {
        console.error('Error inserting message into Supabase:', error);
        throw error;
      }
    } catch (err) {
      console.warn('Supabase insert message failed, stored in memory:', err);
    }
  }

  /**
   * Delete a conversation from Supabase + memory
   */
  public static async deleteConversation(conversationId: string): Promise<boolean> {
    // 1. Delete locally
    const deletedLocal = (db as any).conversations.delete(conversationId);
    (db as any).messages.delete(conversationId);

    if (!isSupabaseConfigured || !supabase) {
      return deletedLocal;
    }

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Error deleting conversation from Supabase:', error);
        throw error;
      }
      return true;
    } catch (err) {
      console.warn('Supabase delete failed, performed locally:', err);
      return deletedLocal;
    }
  }
}
