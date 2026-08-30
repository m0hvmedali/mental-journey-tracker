// server/tests/test_content_service.js
import { contentService } from '../../src/services/contentService.js';
import assert from 'assert';

async function runContentServiceTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING CONTENT SERVICE INTEGRATION & RESILIENCE TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  const runTest = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   └─ Error: ${err.message}\n`);
      failed++;
    }
  };

  // Test 1: Fallback loading for getContentBySlug
  await runTest('getContentBySlug - returns fallback for thinking-errors', async () => {
    const data = await contentService.getContentBySlug('thinking-errors', 'ar');
    assert.ok(data, 'Should return fallback data');
    assert.strictEqual(data.slug, 'thinking-errors');
    assert.strictEqual(data.language, 'ar');
    assert.strictEqual(data.title, 'التشوهات المعرفية (Thinking Errors)');
  });

  // Test 2: Cache hit test
  await runTest('Cache System - successive calls result in zero latency cache hits', async () => {
    const startFirst = Date.now();
    const data1 = await contentService.getContentBySlug('thinking-errors', 'ar');
    const elapsedFirst = Date.now() - startFirst;

    const startSecond = Date.now();
    const data2 = await contentService.getContentBySlug('thinking-errors', 'ar');
    const elapsedSecond = Date.now() - startSecond;

    assert.deepStrictEqual(data1, data2, 'Cached response must match');
    assert.ok(elapsedSecond <= elapsedFirst, `Cache hit should be fast (Second: ${elapsedSecond}ms, First: ${elapsedFirst}ms)`);
  });

  // Test 3: getEmotionsEncyclopedia filtering and fallback
  await runTest('getEmotionsEncyclopedia - loads and filters fallback list correctly', async () => {
    const list = await contentService.getEmotionsEncyclopedia({ search: 'غضب' });
    assert.ok(Array.isArray(list), 'Should return an array');
    const matchesAll = list.every(item => item.name?.includes('غضب') || item.english_name?.toLowerCase().includes('anger'));
    assert.ok(list.length > 0, 'Should find matching emotions');
    assert.ok(matchesAll, 'Every matched emotion must relate to anger/غضب');
  });

  // Test 4: getPsychologyInsights dataset loading
  await runTest('getPsychologyInsights - gracefully loads from file fallback', async () => {
    const insights = await contentService.getPsychologyInsights();
    assert.ok(Array.isArray(insights), 'Should return list of insights');
  });

  // Test 5: searchContent fallback logic
  await runTest('searchContent - fallbacks to in-memory search for offline queries', async () => {
    const results = await contentService.searchContent('التشوهات');
    assert.ok(Array.isArray(results), 'Should return search array');
    assert.ok(results.length > 0, 'Should return matching items from fallback');
    assert.strictEqual(results[0].slug, 'thinking-errors');
  });

  // Test 6: getScientificReferences returns array or fallback gracefully
  await runTest('getScientificReferences - completes query gracefully', async () => {
    const refs = await contentService.getScientificReferences();
    assert.ok(Array.isArray(refs), 'Should return an array');
  });

  // Test 7: Handles non-existent items without throwing exceptions
  await runTest('Safe Fallback - returns null/empty array for unknown inputs without crashing', async () => {
    const data = await contentService.getContentBySlug('non-existent-slug', 'ar');
    assert.strictEqual(data, null, 'Unknown slug should return null gracefully');

    const refs = await contentService.getScientificReferences({ category: 'unknown-cat' });
    assert.ok(Array.isArray(refs), 'Unknown category should return empty or subset array');
  });

  console.log('\n================================================================');
  console.log(`📊 CONTENT SERVICE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    globalThis.process.exit(1);
  }
}

runContentServiceTests().catch(err => {
  console.error('Test framework crashed:', err);
  globalThis.process.exit(1);
});
