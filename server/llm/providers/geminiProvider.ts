import { GoogleGenAI } from '@google/genai';
import { LLMProvider, LLMGenerationRequest, LLMGenerationResponse } from '../types';
import { PromptBuilder } from '../promptBuilder';

export class GeminiProvider implements LLMProvider {
  name = 'gemini';
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    if (!this.ai) {
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  public isAvailable(): boolean {
    return Boolean(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY);
  }

  public async generateResponse(request: LLMGenerationRequest): Promise<LLMGenerationResponse> {
    const startTime = Date.now();
    const client = this.getClient();

    if (!client) {
      throw new Error('GOOGLE_AI_API_KEY or GEMINI_API_KEY is not configured');
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const systemPrompt = PromptBuilder.buildSystemPrompt();
    const userPrompt = PromptBuilder.buildUserPrompt(request);

    const response = await client.models.generateContent({
      model: modelName,
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: request.temperature ?? 0.2,
        maxOutputTokens: request.maxTokens ?? 1024,
      }
    });

    const text = response.text || '';
    const latencyMs = Date.now() - startTime;

    return {
      content: text.trim(),
      provider: 'gemini',
      model: modelName,
      latencyMs,
      isFallback: false
    };
  }
}
