import { getConfig } from '../config/chatbot.config';

export interface AuditLogPayload {
  timestamp: string;
  conversationId?: string;
  userQuery: string;
  normalizedQuery: string;
  detectedEntities: string[];
  detectedIntent: string;
  resolvedQuery?: string;
  searchResults: Array<{ title: string; score: number; type: string }>;
  searchScores: Record<string, number>;
  selectedContext: {
    activeTopic: string | null;
    entities: string[];
    recentMessagesCount: number;
  };
  confidence: {
    searchConfidence: number;
    contextConfidence: number;
    overallConfidence: number;
    responseType: string;
  };
  llmRequest: {
    provider: string;
    model: string;
    systemPromptPreview: string;
  };
  llmResponse: {
    provider: string;
    latencyMs: number;
    isFallback: boolean;
  };
  finalResponse: string;
}

export class ChatbotLogger {
  public static logPipelineExecution(payload: AuditLogPayload): void {
    const config = getConfig().logging;
    if (!config.enabled) return;

    const separator = '─'.repeat(70);
    const border = '═'.repeat(70);

    console.log(`\n${border}`);
    console.log(`🤖 [HYBRID CHATBOT PIPELINE EXECUTION] - ${payload.timestamp}`);
    console.log(`Conversation ID: ${payload.conversationId || 'N/A'}`);
    console.log(separator);

    console.log(`📥 1. USER_QUERY: "${payload.userQuery}"`);
    console.log(`🔍 2. NORMALIZED_QUERY: "${payload.normalizedQuery}"`);
    if (payload.resolvedQuery && payload.resolvedQuery !== payload.userQuery) {
      console.log(`🔄 3. RESOLVED_QUERY (Context/Pronoun): "${payload.resolvedQuery}"`);
    }

    console.log(`🏷️ 4. DETECTED_ENTITIES: [${payload.detectedEntities.join(', ') || 'None'}] (Intent: ${payload.detectedIntent})`);

    console.log(`📊 5. SEARCH_RESULTS (${payload.searchResults.length} matches):`);
    payload.searchResults.forEach((res, i) => {
      console.log(`   [#${i + 1}] (${res.type.toUpperCase()}) Score: ${res.score.toFixed(3)} - "${res.title}"`);
    });

    console.log(`⚖️ 6. CONFIDENCE & RESPONSE TYPE:`);
    console.log(`   • Search Confidence: ${payload.confidence.searchConfidence.toFixed(3)}`);
    console.log(`   • Context Confidence: ${payload.confidence.contextConfidence.toFixed(3)}`);
    console.log(`   • Overall Confidence: ${payload.confidence.overallConfidence.toFixed(3)}`);
    console.log(`   • Target Response Type: ${payload.confidence.responseType}`);

    console.log(`🧠 7. SELECTED_CONTEXT: Topic: "${payload.selectedContext.activeTopic || 'None'}" | Active Entities: [${payload.selectedContext.entities.join(', ')}]`);

    console.log(`🚀 8. LLM_REQUEST: Provider: ${payload.llmRequest.provider} | Model: ${payload.llmRequest.model}`);
    console.log(`⏱️ 9. LLM_RESPONSE: Latency: ${payload.llmResponse.latencyMs}ms (Fallback: ${payload.llmResponse.isFallback})`);

    console.log(`💬 10. FINAL_RESPONSE:\n${payload.finalResponse}`);
    console.log(`${border}\n`);
  }
}
