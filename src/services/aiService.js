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

// ---------------------------------------------------------
// AI Provider Abstraction
// ---------------------------------------------------------
class AIProvider {
  async chat() { throw new Error('Not implemented'); }
  async formatMarkdown() { throw new Error('Not implemented'); }
}

class GeminiVercelProvider extends AIProvider {
  async getAuthHeaders() {
    // For Vercel Serverless API, we pass the Supabase session token if available
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': session ? `Bearer ${session.access_token}` : 'Bearer anonymous'
    };
  }

  async chat({ message, conversationId, history, userId }) {
    const headers = await this.getAuthHeaders();
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, conversationId, history, userId })
    });

    if (!response.ok) {
      throw new Error(`Gemini Chat API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async formatMarkdown({ rawText, instructions }) {
    const headers = await this.getAuthHeaders();
    const response = await fetch('/api/ai/format', {
      method: 'POST',
      headers,
      body: JSON.stringify({ rawText, instructions })
    });

    if (!response.ok) {
      throw new Error(`Gemini Format API error: ${response.statusText}`);
    }

    return await response.json();
  }
}

class OllamaLocalProvider extends AIProvider {
  constructor(baseUrl = 'http://localhost:11434') {
    super();
    this.baseUrl = baseUrl;
    this.model = 'llama3'; // Default local model, can be made configurable
  }

  async checkAvailability() {
    try {
      // Fast short-circuit timeout to not block the UI if Ollama is off
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false; // Offline or CORS blocked
    }
  }

  async chat({ message, conversationId, history }) {
    const systemInstruction = `أنت "مساعد الرحلة النفسية" - رفيق ومساعد نفسي داعم ومتعاطف يعتمد على أسس العلاج المعرفي السلوكي (CBT)، علاج القبول والالتزام (ACT)، واليقظة الذهنية (Mindfulness).
الأسلوب: دافئ، غير حكمي، محترم، واضح باللغة العربية الفصحى البسيطة.`;

    let prompt = systemInstruction + '\\n\\n';
    if (history && history.length > 0) {
      prompt += history.map((h) => `${h.role === 'assistant' ? 'Assistant' : 'User'}: ${h.content}`).join('\\n') + '\\n';
    }
    prompt += `User: ${message}\\nAssistant:`;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

    const data = await response.json();
    return {
      success: true,
      data: {
        messageId: `msg_ollama_${Date.now()}`,
        conversationId,
        response: data.response
      }
    };
  }

  async formatMarkdown({ rawText, instructions }) {
    const systemInstruction = `أنت مساعد ذكي مهمتك تنسيق النصوص وتحويلها إلى Markdown منظم وجذاب لمدونة للصحة النفسية.`;
    const prompt = `${systemInstruction}\\n${instructions ? `تعليمات إضافية: ${instructions}\\n` : ''}الرجاء تنسيق هذا النص:\\n${rawText}`;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

    const data = await response.json();
    return { markdown: data.response };
  }
}

// ---------------------------------------------------------
// Unified AI Service
// ---------------------------------------------------------
class UnifiedAIService {
  constructor() {
    this.gemini = new GeminiVercelProvider();
    this.ollama = new OllamaLocalProvider();
    
    // Configurable provider chain order
    this.providerChain = [
      this.gemini,
      this.ollama
    ];
  }

  /**
   * Send a chat message to the AI Assistant via configured providers with graceful fallback
   */
  async sendMessage({ message, conversationId, history = [], userId }) {
    if (!isSupabaseConfigured) {
      return this._buildSafeFallback(message, conversationId);
    }

    for (const provider of this.providerChain) {
      try {
        if (provider instanceof OllamaLocalProvider) {
          const isAvailable = await provider.checkAvailability();
          if (!isAvailable) continue; // Skip quickly if Ollama is not running locally
        }

        const result = await provider.chat({ message, conversationId, history, userId });
        if (result && result.success) {
          return result;
        }
      } catch (err) {
        console.warn(`[AI Provider Error] ${provider.constructor.name}:`, err);
        // Continue to the next fallback provider
      }
    }

    // If all providers fail, use safe fallback deterministic response
    return this._buildSafeFallback(message, conversationId);
  }

  /**
   * Format raw text to clean Markdown with Callouts
   */
  async formatMarkdown({ rawText, instructions }) {
    if (!isSupabaseConfigured) {
      return rawText;
    }

    for (const provider of this.providerChain) {
      try {
        if (provider instanceof OllamaLocalProvider) {
          const isAvailable = await provider.checkAvailability();
          if (!isAvailable) continue;
        }

        const result = await provider.formatMarkdown({ rawText, instructions });
        if (result && result.markdown) {
          return result.markdown;
        }
      } catch (err) {
        console.warn(`[AI Provider Error] ${provider.constructor.name}:`, err);
      }
    }

    // Fallback: return raw text if all providers fail
    return rawText;
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
