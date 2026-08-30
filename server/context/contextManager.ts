import { db } from '../database/memoryStore';
import { ConversationContextState, ResolvedReference, SelectedContext } from './types';
import { ReferenceResolver } from './referenceResolver';
import { getConfig } from '../config/chatbot.config';

export class ContextManager {
  private states: Map<string, ConversationContextState> = new Map();

  public getOrCreateState(conversationId: string): ConversationContextState {
    let state = this.states.get(conversationId);
    if (!state) {
      const conv = db.getOrCreateConversation(conversationId);
      state = {
        conversationId,
        currentTopic: conv.currentTopic || null,
        activeEntityIds: conv.activeEntityIds || [],
        previousEntityIds: conv.previousEntityIds || [],
        lastRequestedAttribute: null,
        lastIntent: null,
        topicHistory: [],
        turnCount: 0
      };
      this.states.set(conversationId, state);
    }
    return state;
  }

  /**
   * Process user query within conversation context
   */
  public processContext(conversationId: string, rawQuery: string, newlyDetectedEntityIds: string[], detectedAttr: string | null, intent: string): {
    state: ConversationContextState;
    resolution: ResolvedReference;
    effectiveEntityIds: string[];
    effectiveQuery: string;
  } {
    const state = this.getOrCreateState(conversationId);

    // 1. Resolve references if query relies on previous context
    const resolution = ReferenceResolver.resolve(rawQuery, state);
    const effectiveQuery = resolution.hasReference ? resolution.resolvedQuery : rawQuery;

    // 2. Determine active entity list
    let effectiveEntityIds: string[] = [];
    if (newlyDetectedEntityIds.length > 0) {
      effectiveEntityIds = newlyDetectedEntityIds;
    } else if (resolution.appliedEntityIds.length > 0) {
      effectiveEntityIds = resolution.appliedEntityIds;
    } else if (state.activeEntityIds.length > 0) {
      effectiveEntityIds = state.activeEntityIds;
    }

    // 3. Update State
    if (newlyDetectedEntityIds.length > 0) {
      // If new entity detected, check if topic shifted
      const primaryNewId = newlyDetectedEntityIds[0];
      const newEntity = db.getEntity(primaryNewId);

      if (state.activeEntityIds.length > 0 && !state.activeEntityIds.includes(primaryNewId)) {
        // Shift previous entity to history
        state.previousEntityIds = [...state.activeEntityIds];
        if (state.currentTopic && !state.topicHistory.includes(state.currentTopic)) {
          state.topicHistory.push(state.currentTopic);
        }
      }

      state.activeEntityIds = newlyDetectedEntityIds;
      state.currentTopic = newEntity ? newEntity.name : null;
    } else if (resolution.appliedEntityIds.length > 0) {
      state.previousEntityIds = [...state.activeEntityIds];
      state.activeEntityIds = resolution.appliedEntityIds;
      const resolvedEnt = db.getEntity(resolution.appliedEntityIds[0]);
      if (resolvedEnt) state.currentTopic = resolvedEnt.name;
    }

    if (detectedAttr) {
      state.lastRequestedAttribute = detectedAttr;
    }
    state.lastIntent = intent;
    state.turnCount++;

    // Sync with database record
    db.updateConversation(conversationId, {
      currentTopic: state.currentTopic || undefined,
      activeEntityIds: state.activeEntityIds,
      previousEntityIds: state.previousEntityIds
    });

    return {
      state,
      resolution,
      effectiveEntityIds,
      effectiveQuery
    };
  }

  /**
   * Select minimal, high-relevance context for LLM prompt
   */
  public selectContextForLLM(conversationId: string, effectiveQuery: string, resolution?: ResolvedReference): SelectedContext {
    const config = getConfig().context;
    const maxMessages = config.maxHistoryMessages || 4;

    const state = this.getOrCreateState(conversationId);
    const activeEntities = state.activeEntityIds.map(id => {
      const ent = db.getEntity(id);
      return ent ? { id: ent.id, name: ent.name, category: ent.category } : null;
    }).filter(Boolean) as Array<{ id: string; name: string; category?: string }>;

    // Get last N messages (excluding system instructions, just user/assistant turns)
    const rawMessages = db.getMessages(conversationId, maxMessages);
    const relevantRecentMessages = rawMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    return {
      activeEntities,
      relevantRecentMessages,
      currentTopic: state.currentTopic,
      resolvedQuery: effectiveQuery,
      referenceResolution: resolution
    };
  }
}

export const contextManager = new ContextManager();
