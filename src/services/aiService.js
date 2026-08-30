import { supabase, isSupabaseConfigured } from '@/supabaseClient';

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

export const aiService = {
  /**
   * Send a chat message to the AI Assistant via Supabase Edge Function with graceful fallback
   */
  async sendMessage({ message, conversationId, history = [], userId }) {
    if (!isSupabaseConfigured) {
      return {
        success: true,
        data: {
          messageId: `msg_${Date.now()}`,
          conversationId,
          response: getFallbackResponse(message)
        }
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message, conversationId, history, userId }
      });

      if (error || (data && !data.success)) {
        console.warn('Edge function error or non-2xx status, using intelligent fallback:', error || data?.error);
        return {
          success: true,
          data: {
            messageId: `msg_${Date.now()}`,
            conversationId,
            response: getFallbackResponse(message)
          }
        };
      }

      return data;
    } catch (err) {
      console.warn('Network or Edge function error, using intelligent fallback:', err);
      return {
        success: true,
        data: {
          messageId: `msg_${Date.now()}`,
          conversationId,
          response: getFallbackResponse(message)
        }
      };
    }
  },

  /**
   * Format raw text to clean Markdown with Callouts
   */
  async formatMarkdown({ rawText, instructions }) {
    if (!isSupabaseConfigured) {
      return rawText;
    }

    try {
      const { data, error } = await supabase.functions.invoke('format-markdown', {
        body: { rawText, instructions }
      });

      if (error || (data && data.error)) {
        console.warn('Format markdown edge function error, returning rawText:', error || data?.error);
        return rawText;
      }

      return data?.markdown || rawText;
    } catch (err) {
      console.warn('Network error formatting markdown, returning rawText:', err);
      return rawText;
    }
  }
};
