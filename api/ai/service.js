/* global process */
import { GeminiProvider, OllamaProvider } from './providers.js';

export class AIService {
  constructor() {
    this.gemini = new GeminiProvider();
    this.ollama = new OllamaProvider();
  }

  getProviders() {
    const primaryName = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();
    const fallbackName = (process.env.AI_FALLBACK_PROVIDER || '').toLowerCase().trim();

    const map = {
      gemini: this.gemini,
      ollama: this.ollama,
    };

    let primary = map[primaryName] || this.gemini;
    let fallback = fallbackName && fallbackName !== primaryName ? map[fallbackName] : null;

    // Auto-select provider if primary is not configured
    if (!primary.isConfigured()) {
      if (fallback && fallback.isConfigured()) {
        primary = fallback;
        fallback = null;
      } else if (primaryName !== 'ollama' && this.ollama.isConfigured()) {
        primary = this.ollama;
      } else if (primaryName !== 'gemini' && this.gemini.isConfigured()) {
        primary = this.gemini;
      }
    }

    return { primary, fallback };
  }

  async chat({ message, history = [], systemInstruction, stream = false, onToken }) {
    const { primary, fallback } = this.getProviders();

    if (!primary.isConfigured() && (!fallback || !fallback.isConfigured())) {
      throw new Error('No AI provider is properly configured. Please check GEMINI_API_KEY or OLLAMA_API_KEY environment variables.');
    }

    try {
      const response = await primary.chat({
        message,
        history,
        systemInstruction,
        stream,
        onToken
      });
      return { response, provider: primary.name };
    } catch (primaryErr) {
      console.warn(`[AI Service] Primary provider (${primary.name}) failed:`, primaryErr.message);

      if (fallback && fallback.isConfigured()) {
        console.warn(`[AI Service] Attempting fallback provider (${fallback.name})...`);
        try {
          const response = await fallback.chat({
            message,
            history,
            systemInstruction,
            stream,
            onToken
          });
          return { response, provider: fallback.name };
        } catch (fallbackErr) {
          console.error(`[AI Service] Fallback provider (${fallback.name}) failed:`, fallbackErr.message);
          throw new Error(`AI Request failed on both primary (${primary.name}) and fallback (${fallback.name}) providers.`);
        }
      }

      // Safe normalized error message without secret exposure
      const safeErrorMsg = primaryErr.message
        ? primaryErr.message.replace(/([a-zA-Z0-9_-]{20,})/g, '***HIDDEN_KEY***')
        : 'AI provider failed to generate a response.';
      throw new Error(safeErrorMsg);
    }
  }

  async formatMarkdown({ rawText, instructions }) {
    const { primary, fallback } = this.getProviders();

    if (!primary.isConfigured() && (!fallback || !fallback.isConfigured())) {
      return rawText;
    }

    try {
      return await primary.formatMarkdown({ rawText, instructions });
    } catch (primaryErr) {
      console.warn(`[AI Service Format] Primary provider (${primary.name}) failed:`, primaryErr.message);
      if (fallback && fallback.isConfigured()) {
        try {
          return await fallback.formatMarkdown({ rawText, instructions });
        } catch (fallbackErr) {
          console.error(`[AI Service Format] Fallback provider (${fallback.name}) failed:`, fallbackErr.message);
        }
      }
      return rawText;
    }
  }
}

export const aiServerService = new AIService();
