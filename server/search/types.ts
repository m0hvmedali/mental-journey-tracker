export interface SearchQuery {
  rawQuery: string;
  normalizedQuery: string;
  tokens: string[];
  requestedAttribute?: string | null;
  detectedEntities?: string[];
  contextEntityIds?: string[];
  conversationId?: string;
  limit?: number;
}

export interface CandidateResult {
  id: string;
  type: 'entity' | 'attribute' | 'document' | 'fact' | 'comparison';
  title: string;
  entityId?: string;
  entityName?: string;
  attributeKey?: string;
  attributeValue?: any;
  unit?: string;
  matchedText: string;
  strategyScores: Record<string, number>;
  rawScore: number;
  finalScore: number; // 0.0 to 1.0
  relevanceExplanation: string;
  metadata?: Record<string, any>;
}

export interface SearchStrategy {
  name: string;
  weight: number;
  search(query: SearchQuery): Promise<CandidateResult[]> | CandidateResult[];
}

export interface SearchRetrievalOutput {
  query: string;
  normalizedQuery: string;
  intent: string;
  detectedEntities: string[];
  requestedAttribute: string | null;
  searchConfidence: number; // 0.0 to 1.0
  results: Array<{
    id: string;
    type: string;
    score: number;
    title: string;
    data: any;
    explanation?: string;
  }>;
  contextUsed: {
    activeEntityIds: string[];
    topic?: string;
    resolvedQuery?: string;
  };
}
