import { LLMProvider } from './types';
import { GeminiProvider } from './providers/geminiProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { MockProvider } from './providers/mockProvider';
import { getConfig } from '../config/chatbot.config';

export class LLMFactory {
  private static geminiProvider = new GeminiProvider();
  private static openaiProvider = new OpenAIProvider('openai');
  private static groqProvider = new OpenAIProvider('groq');
  private static openrouterProvider = new OpenAIProvider('openrouter');
  private static mockProvider = new MockProvider();

  /**
   * Get the active LLM Provider according to system configuration and availability
   */
  public static getProvider(overrideProviderName?: string): LLMProvider {
    const config = getConfig().llm;
    const providerName = (overrideProviderName || config.provider || 'auto').toLowerCase();

    if (providerName === 'gemini') {
      if (this.geminiProvider.isAvailable()) return this.geminiProvider;
      return this.mockProvider;
    }

    if (providerName === 'openai') {
      if (this.openaiProvider.isAvailable()) return this.openaiProvider;
      return this.mockProvider;
    }

    if (providerName === 'groq') {
      if (this.groqProvider.isAvailable()) return this.groqProvider;
      return this.mockProvider;
    }

    if (providerName === 'openrouter') {
      if (this.openrouterProvider.isAvailable()) return this.openrouterProvider;
      return this.mockProvider;
    }

    if (providerName === 'mock') {
      return this.mockProvider;
    }

    // Auto mode: Try Gemini -> OpenAI -> Groq -> OpenRouter -> Mock
    if (this.geminiProvider.isAvailable()) return this.geminiProvider;
    if (this.openaiProvider.isAvailable()) return this.openaiProvider;
    if (this.groqProvider.isAvailable()) return this.groqProvider;
    if (this.openrouterProvider.isAvailable()) return this.openrouterProvider;

    return this.mockProvider;
  }
}
