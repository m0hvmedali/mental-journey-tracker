import { ResponseType } from '../confidence/confidenceEvaluator';
import { SearchRetrievalOutput } from '../search/types';
import { SelectedContext } from '../context/types';

export interface LLMGenerationRequest {
  userQuery: string;
  responseType: ResponseType;
  retrievalData: SearchRetrievalOutput;
  context: SelectedContext;
  confidence: {
    searchConfidence: number;
    contextConfidence: number;
    overallConfidence: number;
  };
  clarificationOptions?: string[];
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMGenerationResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  latencyMs: number;
  isFallback: boolean;
}

export interface LLMProvider {
  name: string;
  isAvailable(): boolean;
  generateResponse(request: LLMGenerationRequest): Promise<LLMGenerationResponse>;
}
