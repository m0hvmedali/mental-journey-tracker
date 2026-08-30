export type KnowledgeType = 'entity' | 'document' | 'fact' | 'faq' | 'service' | 'company' | 'product';

export interface EntityRecord {
  id: string;
  name: string;
  normalizedName: string;
  type: string; // e.g. 'product', 'company', 'person', 'concept', 'service'
  aliases?: string[];
  normalizedAliases?: string[];
  category?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface AttributeRecord {
  id: string;
  entityId: string;
  key: string; // e.g. 'price', 'foundation_date', 'features', 'specifications'
  normalizedKey: string;
  value: any; // string, number, array, object
  valueType: 'string' | 'number' | 'boolean' | 'list' | 'object';
  unit?: string; // e.g. 'EGP', 'USD', 'GB', 'kg'
  aliases: string[]; // e.g. ['السعر', 'ثمن', 'بكام', 'cost', 'price']
  normalizedAliases: string[];
  metadata?: Record<string, any>;
}

export interface RelationshipRecord {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string; // e.g. 'parent_of', 'variant_of', 'competitor_to', 'part_of', 'successor_to'
  metadata?: Record<string, any>;
}

export interface DocumentRecord {
  id: string;
  title: string;
  normalizedTitle: string;
  content: string;
  normalizedContent: string;
  summary?: string;
  category?: string;
  tags?: string[];
  chunks?: string[];
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface FactRecord {
  id: string;
  subject: string; // Entity or topic
  normalizedSubject: string;
  predicate: string; // Relationship or property
  normalizedPredicate: string;
  object: string; // Value or related entity
  rawText: string;
  normalizedRawText: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    intent?: string;
    entities?: string[];
    confidence?: number;
    responseType?: string;
    searchResultCount?: number;
    [key: string]: any;
  };
}

export interface ConversationRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  currentTopic?: string;
  activeEntityIds: string[];
  previousEntityIds: string[];
  state: Record<string, any>;
  lastQuery?: string;
  lastResponseType?: string;
  messageCount: number;
  user_id?: string;
  title?: string;
}

export interface SearchAuditLogRecord {
  id: string;
  timestamp: number;
  conversationId?: string;
  rawQuery: string;
  normalizedQuery: string;
  detectedEntities: string[];
  detectedIntent: string;
  resolvedQuery?: string;
  searchConfidence: number;
  overallConfidence: number;
  responseType: string;
  resultsCount: number;
  executionTimeMs: number;
  llmUsed: boolean;
}
