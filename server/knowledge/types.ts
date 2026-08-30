export interface RawKnowledgeInput {
  type: 'entity' | 'document' | 'fact' | 'faq' | 'csv' | 'raw_text';
  data: any;
  category?: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface IngestionResult {
  success: boolean;
  insertedEntities: number;
  insertedAttributes: number;
  insertedRelationships: number;
  insertedDocuments: number;
  insertedFacts: number;
  errors: string[];
}

export interface EntityInputDTO {
  name: string;
  type?: string;
  aliases?: string[];
  category?: string;
  description?: string;
  attributes?: Record<string, any> | Array<{ key: string; value: any; unit?: string; aliases?: string[] }>;
  relationships?: Array<{ target: string; relationType: string }>;
  metadata?: Record<string, any>;
}
