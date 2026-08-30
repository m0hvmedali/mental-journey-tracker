import { LLMProvider, LLMGenerationRequest, LLMGenerationResponse } from '../types';
import { PromptBuilder } from '../promptBuilder';

export class DeepSeekProvider implements LLMProvider {
  name = 'deepseek';

  public isAvailable(): boolean {
    return Boolean(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY.trim() !== '');
  }

  public async generateResponse(request: LLMGenerationRequest): Promise<LLMGenerationResponse> {
    const startTime = Date.now();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
    const systemPrompt = PromptBuilder.buildSystemPrompt();
    const userPrompt = PromptBuilder.buildUserPrompt(request);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: request.temperature ?? 0.2,
        max_tokens: request.maxTokens ?? 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API Error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    return {
      content: content.trim(),
      provider: 'deepseek',
      model: modelName,
      tokensUsed: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens
      },
      latencyMs,
      isFallback: false
    };
  }
}
