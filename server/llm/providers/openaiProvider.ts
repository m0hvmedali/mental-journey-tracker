import { LLMProvider, LLMGenerationRequest, LLMGenerationResponse } from '../types';
import { PromptBuilder } from '../promptBuilder';
import { getConfig } from '../../config/chatbot.config';

export class OpenAIProvider implements LLMProvider {
  name: string;
  private endpoint: string;

  constructor(providerName: 'openai' | 'groq' | 'openrouter' = 'openai') {
    this.name = providerName;
    if (providerName === 'groq') {
      this.endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (providerName === 'openrouter') {
      this.endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    } else {
      this.endpoint = 'https://api.openai.com/v1/chat/completions';
    }
  }

  private getApiKey(): string | undefined {
    const config = getConfig().llm;
    if (this.name === 'groq') return config.groqApiKey || process.env.GROQ_API_KEY;
    if (this.name === 'openrouter') return config.openrouterApiKey || process.env.OPENROUTER_API_KEY;
    return config.openaiApiKey || process.env.OPENAI_API_KEY;
  }

  public isAvailable(): boolean {
    return Boolean(this.getApiKey());
  }

  public async generateResponse(request: LLMGenerationRequest): Promise<LLMGenerationResponse> {
    const startTime = Date.now();
    const apiKey = this.getApiKey();

    if (!apiKey) {
      throw new Error(`API key for provider ${this.name} is missing.`);
    }

    const config = getConfig().llm;
    const model = this.name === 'groq'
      ? 'llama-3.3-70b-versatile'
      : this.name === 'openrouter'
        ? 'google/gemini-2.0-flash-001'
        : 'gpt-4o-mini';

    const systemPrompt = PromptBuilder.buildSystemPrompt();
    const userPrompt = PromptBuilder.buildUserPrompt(request);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: request.temperature ?? config.temperature ?? 0.2,
          max_tokens: request.maxTokens ?? config.maxTokens ?? 1024
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`${this.name} API Error [${response.status}]: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const latencyMs = Date.now() - startTime;

      return {
        content: content.trim(),
        provider: this.name,
        model,
        tokensUsed: {
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens
        },
        latencyMs,
        isFallback: false
      };
    } catch (err: any) {
      console.warn(`⚠️ ${this.name} API error encountered, falling back to local factual synthesizer:`, err.message || err);
      const { MockProvider } = await import('./mockProvider');
      const fallback = new MockProvider();
      const res = await fallback.generateResponse(request);
      return {
        ...res,
        latencyMs: Date.now() - startTime,
        isFallback: true
      };
    }
  }
}
