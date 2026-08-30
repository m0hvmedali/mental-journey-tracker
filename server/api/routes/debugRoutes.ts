import { Router } from 'express';
import { GeminiProvider } from '../../llm/providers/geminiProvider';
import { GroqProvider } from '../../llm/providers/groqProvider';
import { DeepSeekProvider } from '../../llm/providers/deepseekProvider';
import { OpenRouterProvider } from '../../llm/providers/openrouterProvider';
import { LLMRouter } from '../../llm/llmRouter';
import { SupabaseStore } from '../../database/supabaseStore';
import { ResponseType } from '../../confidence/confidenceEvaluator';

export const debugRouter = Router();

const providersMap = {
  gemini: new GeminiProvider(),
  groq: new GroqProvider(),
  deepseek: new DeepSeekProvider(),
  openrouter: new OpenRouterProvider()
};

/**
 * GET /api/debug/llm/status
 * Check configuration availability of keys (without disclosing key contents)
 */
debugRouter.get('/status', (req, res) => {
  const status = {
    gemini: {
      configured: Boolean(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
    },
    groq: {
      configured: Boolean(process.env.GROQ_API_KEY),
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b'
    },
    deepseek: {
      configured: Boolean(process.env.DEEPSEEK_API_KEY),
      model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'
    },
    openrouter: {
      configured: Boolean(process.env.OPENROUTER_API_KEY),
      model: process.env.OPENROUTER_MODEL || 'openrouter/free'
    }
  };

  return res.json({ success: true, status });
});

/**
 * POST /api/debug/llm/test-provider
 * Tests standard response generation for a single chosen provider
 */
debugRouter.post('/test-provider', async (req, res) => {
  const { providerName } = req.body;
  const provider = providersMap[providerName as keyof typeof providersMap];

  if (!provider) {
    return res.status(400).json({ success: false, error: 'Invalid provider name specified' });
  }

  if (!provider.isAvailable()) {
    return res.json({
      success: false,
      error: `Provider ${providerName} is not configured (missing environment variable)`
    });
  }

  const dummyRequest = {
    userQuery: 'كيف يمكنني التغلب على القلق؟',
    responseType: 'DIRECT_ANSWER' as ResponseType,
    retrievalData: {
      query: 'قلق',
      normalizedQuery: 'قلق',
      strategy: 'semantic_fallback',
      results: [
        {
          id: 'test_fact',
          type: 'fact' as const,
          title: 'معلومة عن القلق',
          score: 1.0,
          data: {
            matchedText: 'التنفس العميق وتمارين الاسترخاء العضلي المتتابع يساعدان بشكل كبير في تهدئة الجهاز العصبي وتقليل أعراض القلق الحاد.'
          }
        }
      ]
    },
    context: {
      currentTopic: 'القلق',
      activeEntities: [],
      relevantRecentMessages: []
    },
    confidence: {
      searchConfidence: 1.0,
      contextConfidence: 1.0,
      overallConfidence: 1.0
    }
  };

  try {
    const startTime = Date.now();
    const result = await provider.generateResponse(dummyRequest as any);
    const latency = Date.now() - startTime;

    return res.json({
      success: true,
      provider: providerName,
      latencyMs: latency,
      response: result.content,
      modelUsed: result.model,
      tokensUsed: result.tokensUsed
    });
  } catch (err: any) {
    return res.json({
      success: false,
      provider: providerName,
      error: err.message || String(err)
    });
  }
});

/**
 * POST /api/debug/llm/test-failover
 * Simulates custom failovers (e.g., simulating 429, timeout, or general error on specific providers)
 */
debugRouter.post('/test-failover', async (req, res) => {
  const { simulateFailures } = req.body; // e.g. ["gemini", "groq"]
  const failedProviders = Array.isArray(simulateFailures) ? simulateFailures : [];

  const dummyRequest = {
    userQuery: 'هل العلاج السلوكي المعرفي فعال؟',
    responseType: 'DIRECT_ANSWER' as ResponseType,
    retrievalData: {
      query: 'cbt',
      normalizedQuery: 'cbt',
      strategy: 'semantic_fallback',
      results: [
        {
          id: 'test_fact_2',
          type: 'fact' as const,
          title: 'العلاج المعرفي السلوكي',
          score: 1.0,
          data: {
            matchedText: 'العلاج المعرفي السلوكي (CBT) هو إطار علاجي يركز على تعديل الأفكار التلقائية السلبية والسلوكيات غير التكيفية لتعزيز جودة الحياة.'
          }
        }
      ]
    },
    context: {
      currentTopic: 'CBT',
      activeEntities: [],
      relevantRecentMessages: []
    },
    confidence: {
      searchConfidence: 1.0,
      contextConfidence: 1.0,
      overallConfidence: 1.0
    }
  };

  const stepsTaken: Array<{ provider: string; status: string; error?: string }> = [];
  const providersToTry = [
    { name: 'gemini', provider: providersMap.gemini },
    { name: 'groq', provider: providersMap.groq },
    { name: 'deepseek', provider: providersMap.deepseek },
    { name: 'openrouter', provider: providersMap.openrouter }
  ];

  let finalResponse = null;

  for (const item of providersToTry) {
    if (!item.provider.isAvailable()) {
      stepsTaken.push({ provider: item.name, status: 'skipped', error: 'Not configured' });
      continue;
    }

    if (failedProviders.includes(item.name)) {
      stepsTaken.push({
        provider: item.name,
        status: 'simulated_failure',
        error: 'Simulated HTTP 429 Rate Limit Error / Timeout'
      });
      continue;
    }

    try {
      const start = Date.now();
      const resVal = await item.provider.generateResponse(dummyRequest as any);
      finalResponse = {
        provider: item.name,
        content: resVal.content,
        model: resVal.model,
        latencyMs: Date.now() - start
      };
      stepsTaken.push({ provider: item.name, status: 'success' });
      break;
    } catch (err: any) {
      stepsTaken.push({ provider: item.name, status: 'failed', error: err.message || String(err) });
    }
  }

  // If everyone failed, we use the fallback mock provider
  if (!finalResponse) {
    const start = Date.now();
    const mock = new (await import('../../llm/providers/mockProvider')).MockProvider();
    const mockRes = await mock.generateResponse(dummyRequest as any);
    finalResponse = {
      provider: 'mock-synthesizer',
      content: mockRes.content,
      model: mockRes.model,
      latencyMs: Date.now() - start
    };
    stepsTaken.push({ provider: 'mock-synthesizer', status: 'fallback_success' });
  }

  return res.json({
    success: true,
    stepsTaken,
    finalResponse
  });
});

/**
 * GET /api/debug/llm/test-db
 * Creates a complete mock conversation and message flow to test persistence
 */
debugRouter.get('/test-db', async (req, res) => {
  const testConvId = `debug_conv_${Date.now()}`;
  try {
    // 1. Create Conversation
    const conversation = await SupabaseStore.saveConversation(testConvId, {
      id: testConvId,
      user_id: 'debug_tester',
      title: 'محادثة تجريبية لاختبار الحفظ',
      messageCount: 0,
      activeEntityIds: [],
      previousEntityIds: [],
      state: {}
    });

    // 2. Save User Message
    const userMsgId = `debug_msg_u_${Date.now()}`;
    await SupabaseStore.saveMessage({
      id: userMsgId,
      conversationId: testConvId,
      role: 'user',
      content: 'اختبار الحفظ الذكي',
      timestamp: Date.now(),
      metadata: {}
    });

    // 3. Save Assistant Response with full simulated metrics
    const assistantMsgId = `debug_msg_a_${Date.now()}`;
    await SupabaseStore.saveMessage({
      id: assistantMsgId,
      conversationId: testConvId,
      role: 'assistant',
      content: 'تم الحفظ والتحقق بنجاح!',
      timestamp: Date.now(),
      metadata: {
        provider: 'gemini',
        model: 'gemini-2.5-flash-lite',
        latency: 120,
        input_tokens: 30,
        output_tokens: 15,
        fallback_used: false
      }
    });

    // 4. Sync & Fetch back to verify integrity
    const synced = await SupabaseStore.syncConversationAndMessages(testConvId);

    // 5. Cleanup the test conversation to keep database pristine
    await SupabaseStore.deleteConversation(testConvId);

    if (synced && synced.messages.length === 2) {
      return res.json({
        success: true,
        message: 'Database storage integrity verification succeeded!',
        verification: {
          conversationSaved: synced.conversation.title === 'محادثة تجريبية لاختبار الحفظ',
          userMessageSaved: synced.messages[0].content === 'اختبار الحفظ الذكي',
          assistantMessageSaved: synced.messages[1].content === 'تم الحفظ والتحقق بنجاح!',
          metadataSaved: synced.messages[1].metadata?.provider === 'gemini'
        }
      });
    } else {
      throw new Error('Retrieved messages did not match saved records or count was incorrect.');
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Database testing failed: ${err.message || String(err)}`
    });
  }
});
