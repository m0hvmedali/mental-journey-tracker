export interface ChatbotConfig {
  llm: {
    provider: 'gemini' | 'openai' | 'groq' | 'openrouter' | 'mock' | 'auto';
    model: string;
    temperature: number;
    maxTokens: number;
    geminiApiKey?: string;
    openaiApiKey?: string;
    groqApiKey?: string;
    openrouterApiKey?: string;
  };
  search: {
    minConfidenceThreshold: number; // Minimum confidence to accept a match (default: 0.50)
    highConfidenceThreshold: number; // High confidence threshold (default: 0.85)
    clarificationThreshold: number; // Between 0.50 and 0.85 triggers clarification or warning
    maxResults: number;
    fuzzyThreshold: number; // 0.0 - 1.0 (minimum token similarity)
    bm25: {
      k1: number; // Term frequency saturation parameter
      b: number;  // Document length normalization parameter
    };
    weights: {
      exactMatch: number;
      entityMatch: number;
      attributeMatch: number;
      bm25: number;
      fuzzyMatch: number;
      synonymMatch: number;
      contextBoost: number;
    };
  };
  context: {
    maxHistoryMessages: number;
    topicDecayTurns: number;
    enablePronounResolution: boolean;
    enableEllipsisResolution: boolean;
  };
  response: {
    language: 'ar' | 'en' | 'auto';
    style: 'concise' | 'detailed' | 'conversational';
    fallbackMessageAr: string;
    fallbackMessageEn: string;
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
    redactKeys: boolean;
  };
}

export const defaultConfig: ChatbotConfig = {
  llm: {
    provider: (process.env.LLM_PROVIDER as any) || (process.env.GEMINI_API_KEY ? 'gemini' : 'mock'),
    model: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
    temperature: 0.2, // Low temperature for factual precision
    maxTokens: 1024,
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
  },
  search: {
    minConfidenceThreshold: 0.45,
    highConfidenceThreshold: 0.80,
    clarificationThreshold: 0.65,
    maxResults: 5,
    fuzzyThreshold: 0.68,
    bm25: {
      k1: 1.5,
      b: 0.75,
    },
    weights: {
      exactMatch: 1.0,
      entityMatch: 0.95,
      attributeMatch: 0.90,
      bm25: 0.75,
      fuzzyMatch: 0.70,
      synonymMatch: 0.85,
      contextBoost: 0.35,
    },
  },
  context: {
    maxHistoryMessages: 6,
    topicDecayTurns: 4,
    enablePronounResolution: true,
    enableEllipsisResolution: true,
  },
  response: {
    language: 'ar',
    style: 'conversational',
    fallbackMessageAr: 'عذرًا، لم أتمكن من العثور على معلومات مؤكدة للإجابة على سؤالك في قاعدة البيانات المتاحة.',
    fallbackMessageEn: 'Sorry, I could not find verified information to answer your question in the current knowledge base.',
  },
  logging: {
    enabled: true,
    level: 'info',
    redactKeys: true,
  },
};

// Global in-memory configuration state that can be updated dynamically via API
let currentConfig: ChatbotConfig = JSON.parse(JSON.stringify(defaultConfig));

export function getConfig(): ChatbotConfig {
  // Always update keys from environment if set
  if (process.env.GEMINI_API_KEY && !currentConfig.llm.geminiApiKey) {
    currentConfig.llm.geminiApiKey = process.env.GEMINI_API_KEY;
  }
  return currentConfig;
}

export function updateConfig(partial: Partial<ChatbotConfig>): ChatbotConfig {
  currentConfig = {
    ...currentConfig,
    ...partial,
    llm: { ...currentConfig.llm, ...(partial.llm || {}) },
    search: {
      ...currentConfig.search,
      ...(partial.search || {}),
      bm25: { ...currentConfig.search.bm25, ...(partial.search?.bm25 || {}) },
      weights: { ...currentConfig.search.weights, ...(partial.search?.weights || {}) },
    },
    context: { ...currentConfig.context, ...(partial.context || {}) },
    response: { ...currentConfig.response, ...(partial.response || {}) },
    logging: { ...currentConfig.logging, ...(partial.logging || {}) },
  };
  return currentConfig;
}
