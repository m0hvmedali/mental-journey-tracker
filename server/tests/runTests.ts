import { seedDefaultKnowledge } from '../knowledge/defaultKnowledge';
import { HybridChatbotEngine } from '../core/hybridEngine';
import { db } from '../database/memoryStore';

interface TestCase {
  id: number;
  name: string;
  category: string;
  execute: () => Promise<{ passed: boolean; details: string; expected: string; received: string }>;
}

async function runAllTests() {
  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║        HYBRID CHATBOT PSYCHOLOGICAL KNOWLEDGE BASE TEST SUITE           ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

  // 1. Ensure Knowledge Base is Freshly Seeded
  db.clearAll();
  seedDefaultKnowledge();
  const { updateConfig } = await import('../config/chatbot.config');
  updateConfig({ logging: { enabled: false } });
  console.log(`📦 Seeded DB with ${db.getAllEntities().length} entities, ${db.getAllDocuments().length} documents, ${db.getAllFacts().length} facts.\n`);

  let passedCount = 0;
  let failedCount = 0;

  const testCases: TestCase[] = [
    // 1. Direct Question on CBT Model
    {
      id: 1,
      name: 'Direct Concept Question (سؤال مباشر عن العلاج المعرفي السلوكي)',
      category: 'Concept Retrieval',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ما هو العلاج المعرفي السلوكي؟', { providerOverride: 'mock' });
        const hasCBT = res.retrievedData.some(r => r.title.includes('المعرفي السلوكي') || r.title.includes('CBT')) || res.response.includes('سلوكي') || res.response.includes('معرفي');
        const passed = hasCBT && res.confidence.overallConfidence >= 0.70;
        return {
          passed,
          expected: 'استرجاع تعريف ونظرية العلاج المعرفي السلوكي بثقة عالية',
          received: `Confidence: ${res.confidence.overallConfidence}, Matches: ${res.retrievedResultsCount}`,
          details: `Intent: ${res.intent}, ResponseType: ${res.responseType}`
        };
      }
    },

    // 2. Phrasing Variations / Arabic Synonyms
    {
      id: 2,
      name: 'Diagnostic Screener (سؤال عن مقياس القلق GAD-7 ونقاط القطع)',
      category: 'Scales & Metrics',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ما هي درجات ونقاط القطع في مقياس القلق GAD-7؟', { providerOverride: 'mock' });
        const hasGAD7 = res.retrievedData.some(r => r.title.includes('GAD-7') || r.title.includes('GAD7') || r.title.includes('القلق'));
        const passed = hasGAD7 && res.confidence.overallConfidence >= 0.60;
        return {
          passed,
          expected: 'استرجاع بيانات وتفسيرات مقياس GAD-7',
          received: `Confidence: ${res.confidence.overallConfidence}, Response: "${res.response.slice(0, 80)}..."`,
          details: `Matches: ${res.retrievedResultsCount}`
        };
      }
    },

    // 3. Egyptian Colloquial Dialect (سؤال بالعامية المصرية)
    {
      id: 3,
      name: 'Egyptian Colloquial Dialect (سؤال بالعامية عن اضطراب الشخصية الحدية)',
      category: 'Dialect Mapping',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ايه هي اعراض الشخصية الحدية BPD؟', { providerOverride: 'mock' });
        const hasBPD = res.retrievedData.some(r => r.title.includes('الشخصية الحدية') || r.title.includes('BPD') || r.data?.matchedText?.includes('الحدية'));
        const passed = hasBPD;
        return {
          passed,
          expected: 'معالجة العامية ومطابقة اضطراب الشخصية الحدية',
          received: `Matches: ${res.retrievedResultsCount}, Response: "${res.response.slice(0, 80)}..."`,
          details: `Query mapped through Arabic normalizer and dialect mapper`
        };
      }
    },

    // 4. Incomplete Question / Ellipsis in Context
    {
      id: 4,
      name: 'Context & Ellipsis (سؤال استكمالي يعتمد على سياق المحادثة)',
      category: 'Context & Reference Resolution',
      execute: async () => {
        const convId = 'test_conv_ellipsis_' + Date.now();
        // Turn 1: Ask about CBT
        await HybridChatbotEngine.processMessage('كلمنا عن العلاج المعرفي السلوكي CBT', { conversationId: convId, providerOverride: 'mock' });

        // Turn 2: Incomplete follow-up "مين مؤسسه؟"
        const res2 = await HybridChatbotEngine.processMessage('مين مؤسسه؟', { conversationId: convId, providerOverride: 'mock' });
        const hasBeck = res2.response.includes('بيك') || res2.response.includes('Beck') || res2.retrievedData.some(r => r.title.includes('بيك') || r.data?.matchedText?.includes('بيك'));
        const isContextual = res2.responseType === 'CONTEXTUAL_ANSWER' || res2.context.referenceResolution?.hasReference || res2.resolvedQuery?.includes('المعرفي');
        const passed = Boolean(hasBeck || isContextual);

        return {
          passed,
          expected: 'ربط السؤال بـ CBT واسترجاع آرون بيك أو معهد بيك',
          received: `Resolved Query: "${res2.resolvedQuery}", Response: "${res2.response.slice(0, 80)}..."`,
          details: `Resolution Type: ${res2.context.referenceResolution?.referenceType}`
        };
      }
    },

    // 5. Follow-Up Question on Specific Technique
    {
      id: 5,
      name: 'Follow-up on Psychological Concept (التعرض ومنع الاستجابة ERP)',
      category: 'Context Continuation',
      execute: async () => {
        const convId = 'test_conv_followup_' + Date.now();
        // Turn 1: OCD
        await HybridChatbotEngine.processMessage('كيف يتم علاج الوسواس القهري؟', { conversationId: convId, providerOverride: 'mock' });
        // Turn 2: Follow up on ERP
        const res2 = await HybridChatbotEngine.processMessage('طب وتقنية التعرض ومنع الاستجابة ERP بتتعمل ازاي؟', { conversationId: convId, providerOverride: 'mock' });
        const hasERP = res2.retrievedData.some(r => r.title.includes('التعرض') || r.title.includes('ERP') || r.data?.matchedText?.includes('التعرض'));
        const passed = hasERP;

        return {
          passed,
          expected: 'استرجاع تفاصيل فنية التعرض ومنع الاستجابة',
          received: `Matches: ${res2.retrievedResultsCount}, Response: "${res2.response.slice(0, 80)}..."`,
          details: `Resolved Query: ${res2.resolvedQuery}`
        };
      }
    },

    // 6. Cross-Therapy Comparison (CBT vs ACT vs DBT)
    {
      id: 6,
      name: 'Therapy Comparison (المقارنة بين المدارس العلاجية CBT و ACT و DBT)',
      category: 'Comparison Query',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ايه الفرق بين العلاج المعرفي السلوكي CBT وعلاج القبول والالتزام ACT؟', { providerOverride: 'mock' });
        const hasComparison = res.retrievedData.length >= 2 || res.intent === 'COMPARISON';
        const passed = hasComparison;

        return {
          passed,
          expected: 'استرجاع كلا النموذجين ومقارنة الفلسفة والمنهجية',
          received: `Matches: ${res.retrievedResultsCount}, Detected Intent: ${res.intent}`,
          details: `Retrieved entities: ${res.retrievedData.map(r => r.title).join(', ')}`
        };
      }
    },

    // 7. Out-of-Scope / Anti-Hallucination Query
    {
      id: 7,
      name: 'Out of Scope / Unknown Query (سؤال غير موجود في قاعدة المعرفة - منع الهلوسة)',
      category: 'Anti-Hallucination & Guardrails',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ما هي عاصمة دولة البرازيل وسعر تذكرة الطيران إليها؟', { providerOverride: 'mock' });
        const isNoResultOrLow = res.responseType === 'NO_RESULT' || res.responseType === 'LOW_CONFIDENCE' || res.confidence.overallConfidence < 0.40;
        const noHallucination = !res.response.includes('برازيليا') && (res.response.includes('غير متوفر') || res.response.includes('لا توجد') || isNoResultOrLow);
        const passed = isNoResultOrLow || noHallucination;

        return {
          passed,
          expected: 'إرجاع LOW_CONFIDENCE أو NO_RESULT دون اختلاق معلومات جغرافية خارج النطاق',
          received: `Confidence: ${res.confidence.overallConfidence}, ResponseType: ${res.responseType}`,
          details: `Response: "${res.response.slice(0, 80)}..."`
        };
      }
    },

    // 8. Defense Mechanisms Classification
    {
      id: 8,
      name: 'Defense Mechanisms (تصنيف آليات الدفاع عند فايلانت)',
      category: 'Psychological Classification',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ما هي مستويات آليات الدفاع النفسي عند جورج فايلانت؟', { providerOverride: 'mock' });
        const hasVaillant = res.retrievedData.some(r => r.title.includes('فايلانت') || r.title.includes('الدفاع') || r.data?.matchedText?.includes('الدفاع'));
        const passed = hasVaillant;

        return {
          passed,
          expected: 'استرجاع المستويات الأربعة لآليات الدفاع النفسي',
          received: `Matches: ${res.retrievedResultsCount}, Response: "${res.response.slice(0, 80)}..."`,
          details: `Confidence: ${res.confidence.overallConfidence}`
        };
      }
    },

    // 9. Alcohol Screeners (AUDIT vs CAGE)
    {
      id: 9,
      name: 'Alcohol Screeners Comparison (مقارنة مقياس AUDIT واستبيان CAGE)',
      category: 'Screeners Comparison',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('قارن بين مقياس AUDIT واستبيان CAGE لكشف الكحول', { providerOverride: 'mock' });
        const hasScreeners = res.retrievedData.some(r => r.title.includes('AUDIT') || r.title.includes('CAGE'));
        const passed = hasScreeners;

        return {
          passed,
          expected: 'استرجاع مقاييس الكحول وتوضيح الفرق في الحساسية والبنود',
          received: `Matches: ${res.retrievedResultsCount}, Intent: ${res.intent}`,
          details: `Retrieved: ${res.retrievedData.map(r => r.title).join(', ')}`
        };
      }
    },

    // 10. Self-Compassion vs Self-Esteem
    {
      id: 10,
      name: 'Self-Compassion vs Self-Esteem (الشفقة بالذات وتقدير الذات عند كريستين نيف)',
      category: 'Psychological Construct',
      execute: async () => {
        const res = await HybridChatbotEngine.processMessage('ما هي عناصر الشفقة بالذات عند كريستين نيف؟', { providerOverride: 'mock' });
        const hasNeff = res.retrievedData.some(r => r.title.includes('Compassion') || r.title.includes('الشفقة') || r.title.includes('التعاطف') || r.data?.matchedText?.includes('Compassion') || r.data?.matchedText?.includes('الشفقة'));
        const passed = hasNeff;

        return {
          passed,
          expected: 'استرجاع العناصر الثلاثة للشفقة بالذات والفرق بين الشفقة اللطيفة والحازمة',
          received: `Matches: ${res.retrievedResultsCount}, Response: "${res.response.slice(0, 80)}..."`,
          details: `Confidence: ${res.confidence.overallConfidence}`
        };
      }
    }
  ];

  for (const tc of testCases) {
    try {
      const result = await tc.execute();
      if (result.passed) {
        passedCount++;
        console.log(`✅ [PASS] #${tc.id} [${tc.category}] ${tc.name}`);
        console.log(`   └─ Details: ${result.details}`);
        console.log(`   └─ Received: ${result.received}\n`);
      } else {
        failedCount++;
        console.error(`❌ [FAIL] #${tc.id} [${tc.category}] ${tc.name}`);
        console.error(`   └─ Expected: ${result.expected}`);
        console.error(`   └─ Received: ${result.received}`);
        console.error(`   └─ Details: ${result.details}\n`);
      }
    } catch (err: any) {
      failedCount++;
      console.error(`💥 [ERROR] #${tc.id} ${tc.name}: ${err.message}\n`);
    }
  }

  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log(`║ TEST RESULTS: ${passedCount} PASSED / ${failedCount} FAILED (TOTAL: ${testCases.length})`.padEnd(75) + '║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllTests().catch(e => {
  console.error('Test Runner Failed:', e);
  process.exit(1);
});
