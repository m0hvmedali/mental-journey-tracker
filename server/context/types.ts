export interface ConversationContextState {
  conversationId: string;
  currentTopic: string | null;
  activeEntityIds: string[];
  previousEntityIds: string[];
  lastRequestedAttribute: string | null;
  lastIntent: string | null;
  topicHistory: string[];
  turnCount: number;
}

export interface ResolvedReference {
  hasReference: boolean;
  resolvedQuery: string;
  appliedEntityIds: string[];
  referenceType: 'pronoun' | 'variant_modifier' | 'attribute_ellipsis' | 'topic_continuation' | 'none';
  explanation: string;
}

export interface SelectedContext {
  activeEntities: Array<{ id: string; name: string; category?: string }>;
  relevantRecentMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentTopic: string | null;
  resolvedQuery: string;
  referenceResolution?: ResolvedReference;
}
