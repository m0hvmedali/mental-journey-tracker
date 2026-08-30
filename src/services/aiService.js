import { supabase } from '@/supabaseClient';

function getFallbackResponse(message) {
  const msg = (message || '').toLowerCase();
  if (msg.includes('لخص') || msg.includes('summary') || msg.includes('صفحة')) {
    return `مرحباً بك! بناءً على طلبك لتلخيص الصفحة، إليك النقاط الرئيسية:\n\n1. **الفكرة المركزية**: تركز هذه الصفحة على فهم الأنماط النفسية وتطوير أدوات التنظيم العاطفي.\n2. **الأدوات العملية**: استخدام تمارين التنفس الواعي والتقييم المعرفي للأفكار التلقائية.\n3. **الخطوة التالية**: حاول تطبيق تمرين التنفس أو تدوين أفكارك في المفكرة لاستيعاب المفهوم بعمق.\n\nأنا هنا دائماً لمساعدتك في أي استفسار آخر!`;
  }
  if (msg.includes('قلق') || msg.includes('توتر') || msg.includes('خوف')) {
    return `أشعر بما تمرين/تمر به. القلق والتوتر شعور طبيعي يمر به الإنسان، ولكن يمكننا التعامل معه بخطوات بسيطة:\n\n- **التنفس الواعي**: جرب التنفس بعمق (الشهيق لمدة 4 ثوانٍ، الحبس لـ 7، الزفير ببطء لـ 8).\n- **فصل الأفكار (Defusion)**: تذكر أن "أفكارك ليست حقائق"، بل هي مجرد أفكار عابرة.\n\nهل تود أن نقوم بتمرين استرخاء سوياً الآن؟`;
  }
  if (msg.includes('حزن') || msg.includes('اكتئاب') || msg.includes('مكتئب')) {
    return `أقدر مشاركتك لي بما تعانيه. الشعور بالحزن ثقيل، ولكن تذكر أن مشاعرك صالحة ومقبولة تماماً.\n\n- حاول أن تكون لطيفاً مع نفسك اليوم.\n- قم بخطوة صغيرة واحدة تناسب طاقتك الحالية (مثل شرب كوب ماء دافئ أو المشي قليلاً).\n\nأنا معك هنا، كيف يمكنني دعمك أكثر؟`;
  }
  return `أهلاً بك! بصفتي مساعدك النفسي الداعم، أنا هنا لنستكشف معاً أفكارك ومشاعرك ونطور أدوات للتكيف مستندة إلى العلاج المعرفي السلوكي (CBT) واليقظة الذهنية.\n\nكيف تجد حالتك المزاجية اليوم، وبماذا تود أن نبدأ الحديث؟`;
}

class UnifiedAIService {
  async getAuthHeaders() {
    try {
      if (supabase && supabase.auth) {
        const { data: { session } } = await supabase.auth.getSession();
        return {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : 'Bearer anonymous'
        };
      }
    } catch {
      // Ignore auth error if supabase session check fails
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer anonymous'
    };
  }

  /**
   * Send a chat message to the AI Assistant via unified server endpoint (/api/ai/chat).
   * Supports both non-streaming JSON and token-by-token SSE streaming via onChunk.
   */
  async sendMessage({ message, conversationId, history = [], userId, stream = false, onChunk }) {
    try {
      const headers = await this.getAuthHeaders();
      const isStreaming = Boolean(stream || typeof onChunk === 'function');

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          conversationId,
          history,
          userId,
          stream: isStreaming
        })
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: response.statusText };
        }
        throw new Error(errData.error || `AI Chat API error (${response.status})`);
      }

      if (isStreaming && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let provider = null;
        let messageId = null;
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep trailing incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const jsonStr = trimmed.slice(6);
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'token' && event.content) {
                accumulatedText += event.content;
                if (typeof onChunk === 'function') {
                  onChunk(event.content, accumulatedText);
                }
              } else if (event.type === 'done') {
                provider = event.provider;
                messageId = event.messageId;
                if (event.response && !accumulatedText) {
                  accumulatedText = event.response;
                }
              } else if (event.type === 'error') {
                throw new Error(event.error || 'Stream processing error');
              }
            } catch (pErr) {
              console.warn('[AI Service Stream Parse Error]', pErr);
            }
          }
        }

        return {
          success: true,
          data: {
            messageId: messageId || `msg_stream_${Date.now()}`,
            conversationId,
            response: accumulatedText || getFallbackResponse(message),
            provider
          }
        };
      } else {
        const result = await response.json();
        if (result && result.success) {
          return result;
        } else {
          throw new Error(result.error || 'Invalid API response format');
        }
      }
    } catch (err) {
      console.warn('[AI Service] API request failed, using safe fallback:', err.message);
      return this._buildSafeFallback(message, conversationId);
    }
  }

  /**
   * Format raw text to clean Markdown with Callouts
   */
  async formatMarkdown({ rawText, instructions }) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch('/api/ai/format', {
        method: 'POST',
        headers,
        body: JSON.stringify({ rawText, instructions })
      });

      if (!response.ok) {
        throw new Error(`Format API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.markdown || rawText;
    } catch (err) {
      console.warn('[AI Service Format Error]:', err.message);
      return rawText;
    }
  }

  _buildSafeFallback(message, conversationId) {
    return {
      success: true,
      data: {
        messageId: `msg_fallback_${Date.now()}`,
        conversationId,
        response: getFallbackResponse(message)
      }
    };
  }
}

export const aiService = new UnifiedAIService();
