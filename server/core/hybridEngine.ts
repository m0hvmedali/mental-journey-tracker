import { db } from '../database/memoryStore';
import { SupabaseStore } from '../database/supabaseStore';
import { normalizeArabicText } from '../processing/arabicNormalizer';
import { detectRequestedAttribute } from '../processing/dialectMapper';
import { EntityDetector } from '../entity/entityDetector';
import { IntentClassifier } from '../entity/intentClassifier';
import { contextManager } from '../context/contextManager';
import { searchEngine } from '../search/searchEngine';
import { ConfidenceEvaluator } from '../confidence/confidenceEvaluator';
import { LLMRouter } from '../llm';
import { ChatbotLogger } from './logger';

export interface ChatRequestOptions {
  conversationId?: string;
  userId?: string;
  providerOverride?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponseOutput {
  conversationId: string;
  messageId: string;
  response: string;
  query: string;
  resolvedQuery?: string;
  intent: string;
  responseType: string;
  confidence: {
    searchConfidence: number;
    contextConfidence: number;
    overallConfidence: number;
  };
  detectedEntities: Array<{ id: string; name: string; confidence: number }>;
  retrievedResultsCount: number;
  retrievedData: any[];
  context: {
    currentTopic: string | null;
    activeEntities: string[];
    referenceResolution?: any;
  };
  llmMetadata: {
    provider: string;
    model: string;
    latencyMs: number;
    isFallback: boolean;
  };
  executionTimeMs: number;
}

export class HybridChatbotEngine {
  /**
   * Main entry point for processing a user chat message end-to-end
   */
  public static async processMessage(userMessage: string, options?: ChatRequestOptions): Promise<ChatResponseOutput> {
    const pipelineStartTime = Date.now();
    const rawQuery = (userMessage || '').trim();

    // 1. Conversation state initialization
    let conversation: any = null;
    const requestConvId = options?.conversationId;
    if (requestConvId) {
      const synced = await SupabaseStore.syncConversationAndMessages(requestConvId);
      if (synced) {
        conversation = synced.conversation;
      }
    }

    if (!conversation) {
      const newId = requestConvId || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      conversation = await SupabaseStore.saveConversation(newId, {
        id: newId,
        user_id: options?.userId || 'guest',
        title: 'محادثة جديدة',
        messageCount: 0,
        activeEntityIds: [],
        previousEntityIds: [],
        state: {}
      });
    }
    const conversationId = conversation.id;

    // Record user message in DB
    const userMsgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const userMessageRecord = {
      id: userMsgId,
      conversationId,
      role: 'user' as const,
      content: rawQuery,
      timestamp: Date.now(),
      metadata: {}
    };
    await SupabaseStore.saveMessage(userMessageRecord);

    // 2. Query Preprocessing
    const normalizedQuery = normalizeArabicText(rawQuery);
    const detectedAttr = detectRequestedAttribute(normalizedQuery).attribute;

    // 3. Entity Detection
    const detectedEntityResults = EntityDetector.detectEntities(rawQuery);
    const detectedEntityIds = detectedEntityResults.map(e => e.entityId);

    // 4. Intent Classification
    const contextHasEntities = conversation.activeEntityIds.length > 0;
    const intentResult = IntentClassifier.classify(rawQuery, contextHasEntities);
    const intent = intentResult.intent;

    // 5. Context Manager & Reference Resolution
    const contextResult = contextManager.processContext(
      conversationId,
      rawQuery,
      detectedEntityIds,
      detectedAttr,
      intent
    );

    const effectiveQuery = contextResult.effectiveQuery;
    const effectiveEntityIds = contextResult.effectiveEntityIds;

    // 6. Multi-Strategy Search Execution
    const retrieval = await searchEngine.search(rawQuery, {
      conversationId,
      contextEntityIds: effectiveEntityIds,
      detectedEntities: detectedEntityIds,
      intent,
      resolvedQuery: effectiveQuery
    });

    // 7. Confidence & Response Type Evaluation
    const confidenceEval = ConfidenceEvaluator.evaluate(
      retrieval,
      contextResult.resolution,
      intent
    );

    // 8. Minimal Context Selection for LLM
    const selectedContext = contextManager.selectContextForLLM(
      conversationId,
      effectiveQuery,
      contextResult.resolution
    );

    // 9. LLM Generation via Robust Failover LLMRouter
    const llmResponse = await LLMRouter.generate({
      userQuery: rawQuery,
      responseType: confidenceEval.responseType,
      retrievalData: retrieval,
      context: selectedContext,
      confidence: {
        searchConfidence: confidenceEval.searchConfidence,
        contextConfidence: confidenceEval.contextConfidence,
        overallConfidence: confidenceEval.overallConfidence
      },
      clarificationOptions: confidenceEval.clarificationOptions,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens
    });

    const finalResponseText = llmResponse.content;
    const executionTimeMs = Date.now() - pipelineStartTime;

    // 10. Persist Assistant Response in DB with comprehensive AI Usage metrics
    const assistantMsgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const assistantMessageRecord = {
      id: assistantMsgId,
      conversationId,
      role: 'assistant' as const,
      content: finalResponseText,
      timestamp: Date.now(),
      metadata: {
        intent,
        entities: effectiveEntityIds,
        confidence: confidenceEval.overallConfidence,
        responseType: confidenceEval.responseType,
        searchResultCount: retrieval.results.length,
        // Detailed provider usage details
        provider: llmResponse.provider,
        model: llmResponse.model,
        latency: llmResponse.latencyMs,
        input_tokens: llmResponse.tokensUsed?.promptTokens || 0,
        output_tokens: llmResponse.tokensUsed?.completionTokens || 0,
        fallback_used: llmResponse.isFallback
      }
    };
    await SupabaseStore.saveMessage(assistantMessageRecord);

    // Auto-update conversation state and title if first user turn
    const updatedConv = db.getConversation(conversationId);
    if (updatedConv) {
      let title = updatedConv.title;
      if (title === 'محادثة جديدة' || !title) {
        title = rawQuery.length > 30 ? rawQuery.substring(0, 27) + '...' : rawQuery;
      }
      await SupabaseStore.saveConversation(conversationId, {
        activeEntityIds: updatedConv.activeEntityIds,
        previousEntityIds: updatedConv.previousEntityIds,
        state: updatedConv.state,
        messageCount: updatedConv.messageCount,
        title
      });
    }

    // 11. Record Search Audit Log
    db.logSearchAudit({
      conversationId,
      rawQuery,
      normalizedQuery,
      detectedEntities: detectedEntityIds,
      detectedIntent: intent,
      resolvedQuery: effectiveQuery !== rawQuery ? effectiveQuery : undefined,
      searchConfidence: confidenceEval.searchConfidence,
      overallConfidence: confidenceEval.overallConfidence,
      responseType: confidenceEval.responseType,
      resultsCount: retrieval.results.length,
      executionTimeMs,
      llmUsed: !llmResponse.isFallback
    });

    // 12. Structured Pipeline Logging (Without API keys)
    ChatbotLogger.logPipelineExecution({
      timestamp: new Date().toISOString(),
      conversationId,
      userQuery: rawQuery,
      normalizedQuery,
      detectedEntities: detectedEntityResults.map(e => e.name),
      detectedIntent: intent,
      resolvedQuery: effectiveQuery !== rawQuery ? effectiveQuery : undefined,
      searchResults: retrieval.results.map(r => ({ title: r.title, score: r.score, type: r.type })),
      searchScores: retrieval.results.reduce((acc, r) => ({ ...acc, [r.title]: r.score }), {}),
      selectedContext: {
        activeTopic: selectedContext.currentTopic,
        entities: selectedContext.activeEntities.map(e => e.name),
        recentMessagesCount: selectedContext.relevantRecentMessages.length
      },
      confidence: {
        searchConfidence: confidenceEval.searchConfidence,
        contextConfidence: confidenceEval.contextConfidence,
        overallConfidence: confidenceEval.overallConfidence,
        responseType: confidenceEval.responseType
      },
      llmRequest: {
        provider: llmResponse.provider,
        model: llmResponse.model,
        systemPromptPreview: 'Anti-Hallucination Strict Grounding Prompt'
      },
      llmResponse: {
        provider: llmResponse.provider,
        latencyMs: llmResponse.latencyMs,
        isFallback: llmResponse.isFallback
      },
      finalResponse: finalResponseText
    });

    return {
      conversationId,
      messageId: assistantMsgId,
      response: finalResponseText,
      query: rawQuery,
      resolvedQuery: effectiveQuery !== rawQuery ? effectiveQuery : undefined,
      intent,
      responseType: confidenceEval.responseType,
      confidence: {
        searchConfidence: confidenceEval.searchConfidence,
        contextConfidence: confidenceEval.contextConfidence,
        overallConfidence: confidenceEval.overallConfidence
      },
      detectedEntities: detectedEntityResults.map(e => ({ id: e.entityId, name: e.name, confidence: e.confidence })),
      retrievedResultsCount: retrieval.results.length,
      retrievedData: retrieval.results,
      context: {
        currentTopic: selectedContext.currentTopic,
        activeEntities: effectiveEntityIds,
        referenceResolution: contextResult.resolution
      },
      llmMetadata: {
        provider: llmResponse.provider,
        model: llmResponse.model,
        latencyMs: llmResponse.latencyMs,
        isFallback: llmResponse.isFallback
      },
      executionTimeMs
    };
  }
}
