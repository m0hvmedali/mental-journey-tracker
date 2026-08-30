import { supabase, isSupabaseConfigured } from '@/supabaseClient';

export const aiService = {
  /**
   * Send a chat message to the AI Assistant via Supabase Edge Function or API fallback
   */
  async sendMessage({ message, conversationId, history = [], userId }) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('chat', {
          body: { message, conversationId, history, userId }
        });

        if (!error && data && data.success) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase Edge Function invocation failed, falling back to local /api/chat:', err);
      }
    }

    // Fallback to Express backend /api/chat
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationId,
        userId
      })
    });

    const result = await res.json();
    return result;
  },

  /**
   * Format raw text to clean Markdown with Callouts
   */
  async formatMarkdown({ rawText, instructions }) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('format-markdown', {
          body: { rawText, instructions }
        });

        if (!error && data && data.markdown) {
          return data.markdown;
        }
      } catch (err) {
        console.warn('Supabase Edge Function format-markdown failed, falling back to /api/cms/format-markdown:', err);
      }
    }

    // Fallback to Express /api/cms/format-markdown
    const res = await fetch('/api/cms/format-markdown', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, instructions })
    });

    const data = await res.json();
    return data.markdown;
  }
};
